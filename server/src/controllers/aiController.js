const axios = require("axios");

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Enrollment = require("../models/Enrollment");
const Job = require("../models/Job");

// ==========================================
// HELPER: GET STUDENT LEARNING CONTEXT
// ==========================================

const getStudentContext = async (userId) => {
  try {
    const enrollments = await Enrollment.find({
      user: userId,
    })
      .populate("course", "title category level curriculum")
      .sort({
        lastAccessedAt: -1,
      })
      .limit(10);

    if (!enrollments.length) {
      return "The student is not currently enrolled in any courses.";
    }

    const courseContext = enrollments
      .filter((enrollment) => enrollment.course)
      .map((enrollment, index) => {
        const course = enrollment.course;

        return `
COURSE ${index + 1}

Course: ${course.title}
Category: ${course.category || "Unknown"}
Level: ${course.level || "Unknown"}
Progress: ${enrollment.progress || 0}%
Completed Lessons: ${enrollment.completedLessons?.length || 0}
Total Lessons: ${course.curriculum?.length || 0}
        `.trim();
      })
      .join("\n\n");

    if (!courseContext) {
      return "The student is not currently enrolled in any available courses.";
    }

    return `
The student is currently enrolled in:

${courseContext}
    `.trim();
  } catch (error) {
    console.error("Student Context Error:", error.message);

    return "Student learning information is currently unavailable.";
  }
};

// ==========================================
// HELPER: GET ACTIVE JOB CONTEXT
// ==========================================

const getJobContext = async () => {
  try {
    const jobs = await Job.find({
      isActive: true,

      $or: [
        {
          applicationDeadline: null,
        },
        {
          applicationDeadline: {
            $exists: false,
          },
        },
        {
          applicationDeadline: {
            $gte: new Date(),
          },
        },
      ],
    })
      .select(
        "title company description jobType location workMode experience salary skills requirements responsibilities applyLink applicationDeadline",
      )
      .sort({
        createdAt: -1,
      })
      .limit(20)
      .lean();

    if (!jobs.length) {
      return "There are currently no active jobs or internships available on DevSphere.";
    }

    const jobContext = jobs
      .map((job, index) => {
        return `
JOB ${index + 1}

Title: ${job.title}
Company: ${job.company}
Job Type: ${job.jobType}
Location: ${job.location}
Work Mode: ${job.workMode || "Not specified"}
Experience: ${job.experience || "Not specified"}
Salary: ${job.salary || "Not disclosed"}

Skills:
${job.skills?.length ? job.skills.join(", ") : "Not specified"}

Requirements:
${job.requirements?.length ? job.requirements.join("; ") : "Not specified"}

Responsibilities:
${
  job.responsibilities?.length
    ? job.responsibilities.join("; ")
    : "Not specified"
}

Description:
${job.description}

Application Deadline:
${
  job.applicationDeadline
    ? new Date(job.applicationDeadline).toISOString().split("T")[0]
    : "Not specified"
}

Application Link:
${job.applyLink || "Not specified"}
        `.trim();
      })
      .join("\n\n");

    return jobContext;
  } catch (error) {
    console.error("Job Context Error:", error.message);

    return "DevSphere job information is currently unavailable.";
  }
};

// ==========================================
// HELPER: GENERATE AI RESPONSE
// ==========================================

const generateAIResponse = async (conversationId, userId) => {
  // Get conversation history
  const previousMessages = await Message.find({
    conversation: conversationId,
  })
    .sort({
      createdAt: 1,
    })
    .limit(20);

  // Convert MongoDB messages into AI format
  const messages = previousMessages.map((message) => ({
    role: message.sender === "user" ? "user" : "assistant",

    content: message.text,
  }));

  // ==========================================
  // GET PERSONALIZED PLATFORM CONTEXT
  // ==========================================

  const [studentContext, jobContext] = await Promise.all([
    getStudentContext(userId),
    getJobContext(),
  ]);

  // ==========================================
  // SYSTEM PROMPT
  // ==========================================

  messages.unshift({
    role: "system",

    content: `
You are DevSphere AI, a personal coding, learning, and career mentor for students and developers.

You help users with:

- Programming
- Web development
- MERN stack
- Data structures and algorithms
- Debugging
- Interview preparation
- Software development concepts
- Learning guidance
- Career guidance
- Jobs and internships


==================================================
STUDENT LEARNING CONTEXT
==================================================

${studentContext}


==================================================
AVAILABLE DEVSPHERE JOBS AND INTERNSHIPS
==================================================

${jobContext}


==================================================
LEARNING CONTEXT RULES
==================================================

- Use the student's learning context when relevant.

- If the student asks which courses they are currently learning, use the supplied course information.

- If the student asks about course progress, use the supplied progress information.

- If the student asks what they should learn next, consider their current courses and progress.

- If the question is unrelated to learning progress, do not unnecessarily mention course information.

- Never invent courses, progress, completed lessons, or other student information.

- If learning information is unavailable, clearly say that you do not currently have that information.


==================================================
JOB AND INTERNSHIP RULES
==================================================

- When the user asks about jobs, internships, career opportunities, or job readiness, use the AVAILABLE DEVSPHERE JOBS AND INTERNSHIPS section.

- Treat the provided DevSphere job information as the authoritative list of opportunities currently available on DevSphere.

- When asked what jobs or internships are currently available, directly list the opportunities from the supplied DevSphere job information.

- Recommend only opportunities present in the supplied job information.

- Never invent companies, job titles, internships, salaries, skills, requirements, locations, or opportunities.

- Never claim that you do not have access to DevSphere job listings when job information has been supplied in the context.

- If the supplied job context says that no opportunities are currently available, tell the user that no active opportunities are available.

- Do not recommend expired or inactive opportunities.

- When recommending a job, explain why it may be suitable for the student.

- Compare job skills and requirements with the student's learning context when relevant.

- Clearly identify skills or requirements the student may still need to develop.

- Course enrollment or completion is evidence of learning activity, but it does not automatically prove professional proficiency in a skill.

- If there is not enough information to determine whether the student possesses a required skill, clearly say so instead of assuming it.


==================================================
RESPONSE STYLE
==================================================

- Match the response length to the user's question.

- For simple questions, answer concisely.

- For detailed questions, explain step by step.

- Use simple and practical language.

- Use Markdown formatting when useful.

- Use tables when comparing courses, jobs, skills, or progress.

- Give examples when useful.

- Avoid unnecessary sections.


==================================================
PROGRAMMING QUESTIONS
==================================================

When explaining code:

- Provide correct code when appropriate.
- Format code properly.
- Explain important parts clearly.
- Use simple language.
- Mention time and space complexity when relevant.


==================================================
DEBUGGING QUESTIONS
==================================================

When debugging:

- Identify the likely cause.
- Explain why the problem occurred.
- Provide a corrected solution.
- Explain how the user can verify the fix.


==================================================
CONVERSATION MEMORY
==================================================

Remember the context of the current conversation.

Use previous messages when answering follow-up questions.

Do not repeatedly ask for information that already exists in the conversation or supplied DevSphere context.
    `.trim(),
  });

  // ==========================================
  // CALL OPENROUTER
  // ==========================================

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",

    {
      model: "openrouter/free",
      messages,
    },

    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

        "Content-Type": "application/json",

        "HTTP-Referer": "http://localhost:5173",

        "X-Title": "DevSphere AI",
      },
    },
  );

  const reply = response.data?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("AI provider returned an empty response");
  }

  return reply;
};

// ==========================================
// NORMAL AI CHAT
// ==========================================

const chatWithAI = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    // Validate message
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Validate conversation ID
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    // Find conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Verify conversation ownership
    if (conversation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this conversation",
      });
    }

    // Save user message
    await Message.create({
      conversation: conversationId,
      sender: "user",
      text: message.trim(),
    });

    // Generate personalized AI response
    const reply = await generateAIResponse(conversationId, req.user.id);

    // Save AI response
    await Message.create({
      conversation: conversationId,
      sender: "ai",
      text: reply,
    });

    // Update conversation activity
    conversation.updatedAt = new Date();

    await conversation.save();

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI Chat Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,

      message:
        error.response?.data?.error?.message ||
        error.message ||
        "AI request failed",
    });
  }
};

// ==========================================
// REGENERATE AI RESPONSE
// ==========================================

const regenerateAIResponse = async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    // Find conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Verify conversation ownership
    if (conversation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this conversation",
      });
    }

    // Find latest user message
    const latestUserMessage = await Message.findOne({
      conversation: conversationId,

      sender: "user",
    }).sort({
      createdAt: -1,
    });

    if (!latestUserMessage) {
      return res.status(404).json({
        success: false,
        message: "No user message found to regenerate",
      });
    }

    // Find latest AI response
    const latestAIMessage = await Message.findOne({
      conversation: conversationId,

      sender: "ai",
    }).sort({
      createdAt: -1,
    });

    let oldAIText = null;

    // Temporarily remove previous AI answer
    if (latestAIMessage) {
      oldAIText = latestAIMessage.text;

      await latestAIMessage.deleteOne();
    }

    let reply;

    try {
      // Generate new response using
      // conversation + learning + jobs
      reply = await generateAIResponse(conversationId, req.user.id);
    } catch (error) {
      // Restore previous AI response
      // if regeneration fails
      if (latestAIMessage && oldAIText) {
        await Message.create({
          conversation: conversationId,

          sender: "ai",

          text: oldAIText,
        });
      }

      throw error;
    }

    // Save regenerated response
    await Message.create({
      conversation: conversationId,

      sender: "ai",

      text: reply,
    });

    // Update conversation timestamp
    conversation.updatedAt = new Date();

    await conversation.save();

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "AI Regenerate Error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,

      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to regenerate AI response",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  chatWithAI,
  regenerateAIResponse,
};

const axios = require("axios");

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Enrollment = require("../models/Enrollment");

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
      return `
The student is not currently enrolled in any courses.
      `.trim();
    }

    const courseContext = enrollments
      .filter((enrollment) => enrollment.course)
      .map((enrollment) => {
        return `
Course: ${enrollment.course.title}
Category: ${enrollment.course.category || "Unknown"}
Level: ${enrollment.course.level || "Unknown"}
Progress: ${enrollment.progress || 0}%
Completed Lessons: ${enrollment.completedLessons?.length || 0}
Total Lessons: ${enrollment.course.curriculum?.length || 0}
        `.trim();
      })
      .join("\n\n");

    if (!courseContext) {
      return `
The student is not currently enrolled in any available courses.
      `.trim();
    }

    return `
The student is currently enrolled in:

${courseContext}
    `.trim();
  } catch (error) {
    console.error("Student Context Error:", error.message);

    return `
Student learning information is currently unavailable.
    `.trim();
  }
};

// ==========================================
// HELPER: GENERATE AI RESPONSE
// ==========================================

const generateAIResponse = async (conversationId, userId) => {
  // Get previous conversation messages
  const previousMessages = await Message.find({
    conversation: conversationId,
  })
    .sort({
      createdAt: 1,
    })
    .limit(20);

  // Convert MongoDB messages to AI format
  const messages = previousMessages.map((message) => ({
    role: message.sender === "user" ? "user" : "assistant",

    content: message.text,
  }));

  // Get real student learning information
  const studentContext = await getStudentContext(userId);


  // Add DevSphere AI system instructions
  messages.unshift({
    role: "system",

    content: `
You are DevSphere AI, a personal coding and career mentor for students and developers.

Your job is to help users with:
- Programming
- Web development
- MERN stack
- Data structures and algorithms
- Debugging
- Interview preparation
- Software development concepts
- Learning guidance

STUDENT LEARNING CONTEXT:

${studentContext}

Use the student's learning context when it is relevant.

Rules for learning context:
- If the student asks what courses they are learning, use the supplied course information.
- If the student asks about their progress, use the supplied progress information.
- If the student asks what they should learn next, consider their current courses and progress.
- If their question is unrelated to their courses, answer normally without unnecessarily mentioning their learning data.
- Never invent courses, progress, completed lessons, or other student information that is not provided.
- If learning information is unavailable, clearly say that you do not currently have that information.

Response style:
- Match the length and depth of the response to the user's request.
- For simple questions, answer concisely and directly.
- For detailed questions, explain step by step.
- Use simple and practical language.
- Give examples when useful.
- Format code properly.
- Avoid unnecessary sections unless they help answer the question.

When explaining code:
- Provide correct code when appropriate.
- Explain important parts clearly.
- Mention complexity when relevant.

When debugging:
- Identify the likely cause.
- Explain why the problem occurred.
- Provide a corrected solution.

Remember the current conversation and use previous messages when answering follow-up questions.
    `.trim(),
  });

  // Call OpenRouter
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

    // Make sure conversation belongs
    // to logged-in user
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

    // Generate AI response using:
    // 1. Conversation history
    // 2. Student learning context
    const reply = await generateAIResponse(conversationId, req.user.id);

    // Save AI response
    await Message.create({
      conversation: conversationId,
      sender: "ai",
      text: reply,
    });

    // Update conversation activity time
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

    // Find latest AI message
    const latestAIMessage = await Message.findOne({
      conversation: conversationId,
      sender: "ai",
    }).sort({
      createdAt: -1,
    });

    let oldAIText = null;

    // Temporarily remove old AI answer
    // before regeneration
    if (latestAIMessage) {
      oldAIText = latestAIMessage.text;

      await latestAIMessage.deleteOne();
    }

    let reply;

    try {
      // Regenerate using conversation
      // history + student context
      reply = await generateAIResponse(conversationId, req.user.id);
    } catch (error) {
      // Restore old AI response
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

    // Save regenerated AI response
    await Message.create({
      conversation: conversationId,

      sender: "ai",

      text: reply,
    });

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

module.exports = {
  chatWithAI,
  regenerateAIResponse,
};

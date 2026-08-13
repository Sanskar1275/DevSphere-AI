const Interview = require("../models/Interview");
const Job = require("../models/Job");

// ==========================================
// DEFAULT QUESTIONS
// ==========================================

const technicalQuestions = [
  "Tell me about yourself.",
  "Explain your most challenging project.",
  "What are your strengths as a developer?",
  "What are your weaknesses?",
  "Explain the difference between SQL and NoSQL databases.",
  "What is REST API?",
  "Explain JWT Authentication.",
  "How do you debug an application?",
  "Explain Git and GitHub.",
  "Why should we hire you?",
];

// ==========================================
// ROLE BASED QUESTIONS
// ==========================================

const roleQuestions = {
  react: [
    "What are React Hooks?",
    "Explain Virtual DOM.",
    "Difference between State and Props?",
    "Explain useEffect().",
  ],

  frontend: [
    "Difference between Flexbox and Grid?",
    "Explain CSS Box Model.",
    "What is Responsive Design?",
    "Difference between let, const and var?",
  ],

  backend: [
    "Explain Express middleware.",
    "Difference between Authentication and Authorization.",
    "Explain MongoDB Aggregation.",
    "How does Node.js handle multiple requests?",
  ],

  mern: [
    "Explain MERN Stack Architecture.",
    "How does React communicate with Express?",
    "Explain MongoDB relationships.",
    "Difference between CSR and SSR?",
  ],
};

// ==========================================
// GENERATE QUESTIONS
// ==========================================

function generateQuestions(job) {
  const title = (job.title || "").toLowerCase();

  let extraQuestions = [];

  if (title.includes("react")) {
    extraQuestions = roleQuestions.react;
  } else if (title.includes("frontend")) {
    extraQuestions = roleQuestions.frontend;
  } else if (title.includes("backend")) {
    extraQuestions = roleQuestions.backend;
  } else if (title.includes("mern") || title.includes("full stack")) {
    extraQuestions = roleQuestions.mern;
  }

  return [...technicalQuestions, ...extraQuestions]
    .slice(0, 10)
    .map((question) => ({
      question,
      answer: "",
      score: 0,
      feedback: "",
    }));
}

// ==========================================
// SIMPLE AI SCORING
// ==========================================

function calculateAnswerScore(answer) {
  if (!answer || answer.trim().length === 0) {
    return {
      score: 0,
      feedback: "No answer provided.",
    };
  }

  const words = answer.trim().split(/\s+/).length;

  let score = 4;

  if (words > 20) score = 6;
  if (words > 40) score = 8;
  if (words > 80) score = 10;

  let feedback = "Good answer.";

  if (score <= 4) feedback = "Answer is too short.";

  if (score >= 8) feedback = "Well structured and detailed answer.";

  return {
    score,
    feedback,
  };
}

// ==========================================
// START INTERVIEW
// POST /api/interviews/start/:jobId
// ==========================================

const startInterview = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Prevent multiple active interviews for same job
    const existingInterview = await Interview.findOne({
      user: req.user.id,
      job: jobId,
      status: { $ne: "Completed" },
    });

    if (existingInterview) {
      return res.status(200).json({
        success: true,
        message: "Existing interview found.",
        interview: existingInterview,
      });
    }

    const interview = await Interview.create({
      user: req.user.id,
      job: job._id,
      questions: generateQuestions(job),
      status: "In Progress",
      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Interview started successfully.",
      interview,
    });
  } catch (error) {
    console.error("Start Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start interview.",
    });
  }
};

// ==========================================
// GET INTERVIEW
// GET /api/interviews/:id
// ==========================================

const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("job", "title company location")
      .populate("user", "fullName email");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    if (interview.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview.",
    });
  }
};

// ==========================================
// SUBMIT INTERVIEW
// POST /api/interviews/submit/:id
// ==========================================

const submitInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers are required.",
      });
    }

    let totalQuestionScore = 0;

    interview.questions = interview.questions.map((question, index) => {
      const answer = answers[index] || "";

      const result = calculateAnswerScore(answer);

      totalQuestionScore += result.score;

      return {
        ...question.toObject(),
        answer,
        score: result.score,
        feedback: result.feedback,
      };
    });

    // ======================================
    // CALCULATE SCORES
    // ======================================

    const averageScore = totalQuestionScore / interview.questions.length;

    interview.technicalScore = Math.round(averageScore * 10);

    interview.communicationScore = Math.min(100, interview.technicalScore + 5);

    interview.confidenceScore = Math.min(100, interview.technicalScore + 3);

    interview.overallScore = Math.round(
      (interview.technicalScore +
        interview.communicationScore +
        interview.confidenceScore) /
        3,
    );

    // ======================================
    // AI FEEDBACK
    // ======================================

    interview.strengths = [];
    interview.weaknesses = [];
    interview.recommendations = [];

    if (interview.technicalScore >= 80) {
      interview.strengths.push("Strong technical knowledge");
    } else {
      interview.weaknesses.push("Technical concepts need improvement");

      interview.recommendations.push(
        "Practice technical interview questions regularly.",
      );
    }

    if (interview.communicationScore >= 80) {
      interview.strengths.push("Good communication skills");
    } else {
      interview.weaknesses.push("Improve communication and explanation skills");

      interview.recommendations.push(
        "Practice explaining concepts with examples.",
      );
    }

    if (interview.confidenceScore >= 80) {
      interview.strengths.push("Confident during interview");
    } else {
      interview.weaknesses.push("Needs more confidence while answering");

      interview.recommendations.push("Participate in more mock interviews.");
    }

    if (interview.overallScore >= 90) {
      interview.overallFeedback =
        "Outstanding performance! You demonstrated excellent technical knowledge, communication, and confidence.";

      interview.recommendations.push(
        "You're ready for most software engineering interviews.",
      );
    } else if (interview.overallScore >= 75) {
      interview.overallFeedback =
        "Very good performance. A few improvements can make you interview-ready.";

      interview.recommendations.push(
        "Keep practicing advanced interview questions.",
      );
    } else if (interview.overallScore >= 60) {
      interview.overallFeedback =
        "Average performance. Focus on improving both technical and communication skills.";

      interview.recommendations.push(
        "Review core concepts and solve more coding problems.",
      );
    } else {
      interview.overallFeedback =
        "Interview performance needs significant improvement.";

      interview.recommendations.push(
        "Revise fundamentals and attempt more mock interviews.",
      );
    }

    interview.status = "Completed";

    interview.completedAt = new Date();

    interview.reportGenerated = true;

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview submitted successfully.",
      interview,
    });
  } catch (error) {
    console.error("Submit Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit interview.",
    });
  }
};

// ==========================================
// GET INTERVIEW HISTORY
// GET /api/interviews/history
// ==========================================

const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
    })
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Interview History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview history.",
    });
  }
};

module.exports = {
  startInterview,
  getInterview,
  submitInterview,
  getInterviewHistory,
};

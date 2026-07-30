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
    "Explain Express.js middleware.",
    "Difference between Authentication and Authorization.",
    "Explain MongoDB Aggregation.",
    "How does Node.js handle multiple requests?",
  ],

  mern: [
    "Explain MERN Architecture.",
    "How does React communicate with Express?",
    "Explain MongoDB relationships.",
    "Difference between SSR and CSR?",
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

  const questions = [...technicalQuestions, ...extraQuestions];

  return questions.slice(0, 10).map((question) => ({
    question,
  }));
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

    const questions = generateQuestions(job);

    const interview = await Interview.create({
      user: req.user.id,

      job: job._id,

      questions,

      status: "In Progress",

      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,

      message: "Interview started successfully.",

      interview,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message || "Failed to start interview.",
    });
  }
};

// ==========================================
// GET INTERVIEW
// GET /api/interviews/:id
// ==========================================

const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate(
      "job",
      "title company",
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    return res.json({
      success: true,
      interview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startInterview,
  getInterview,
};

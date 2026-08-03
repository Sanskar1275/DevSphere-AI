const mongoose = require("mongoose");

// ==========================================
// QUESTION SCHEMA
// ==========================================

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      default: "",
      trim: true,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

// ==========================================
// INTERVIEW SCHEMA
// ==========================================

const interviewSchema = new mongoose.Schema(
  {
    // ======================================
    // USER
    // ======================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ======================================
    // JOB
    // ======================================

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // ======================================
    // QUESTIONS
    // ======================================

    questions: {
      type: [questionSchema],
      default: [],
    },

    // ======================================
    // AI SCORES
    // ======================================

    technicalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    communicationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    confidenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ======================================
    // AI FEEDBACK
    // ======================================

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    overallFeedback: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================================
    // STATUS
    // ======================================

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // FUTURE FEATURES
    // ======================================

    duration: {
      type: Number,
      default: 0,
    },

    aiModel: {
      type: String,
      default: "DevSphere AI",
    },

    reportGenerated: {
      type: Boolean,
      default: false,
    },

    reportUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Interview", interviewSchema);

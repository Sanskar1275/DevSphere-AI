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
  { _id: false },
);

// ==========================================
// INTERVIEW SCHEMA
// ==========================================

const interviewSchema = new mongoose.Schema(
  {
    // Student
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Job
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Interview Questions
    questions: {
      type: [questionSchema],
      default: [],
    },

    // Overall Scores
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

    // AI Feedback
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

    // Status
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Interview", interviewSchema);

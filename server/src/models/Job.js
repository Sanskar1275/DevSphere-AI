const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Internship",
        "Contract",
      ],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    workMode: {
      type: String,
      enum: [
        "Remote",
        "On-site",
        "Hybrid",
      ],
      default: "On-site",
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    salary: {
      type: String,
      default: "Not Disclosed",
    },

    skills: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    applyLink: {
      type: String,
      required: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Job",
  jobSchema
);


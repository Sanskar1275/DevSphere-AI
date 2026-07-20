const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      default: "Beginner",
    },

    lessons: {
      type: Number,
      default: 0,
    },

    duration: {
      type: String,
      default: "0 Hours",
    },

    rating: {
      type: Number,
      default: 5,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    instructor: {
      type: String,
      default: "DevSphere Team",
    },

    enrolledStudents: {
      type: Number,
      default: 2540,
    },

    progress: {
      type: Number,
      default: 0,
    },

    requirements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    curriculum: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
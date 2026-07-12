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
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    lessons: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 5,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    enrolledStudents: {
      type: Number,
      default: 0,
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
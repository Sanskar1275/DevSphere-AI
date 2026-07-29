const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Student who applied
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Job being applied for
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Current application status
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
        "Withdrawn",
      ],
      default: "Applied",
    },

    // Optional message from student
    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent the same user from applying
// to the same job multiple times
applicationSchema.index(
  {
    user: 1,
    job: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Application", applicationSchema);

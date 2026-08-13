const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC USER INFORMATION
    // ==========================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ==========================================
    // PASSWORD
    // ==========================================

    password: {
      type: String,
      default: null,
    },

    // ==========================================
    // GOOGLE AUTHENTICATION
    // ==========================================

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // ==========================================
    // USER ROLE
    // ==========================================

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    // ==========================================
    // NOTIFICATION PREFERENCES
    // ==========================================

    notifications: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },

      interviewNotifications: {
        type: Boolean,
        default: true,
      },

      jobRecommendations: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);

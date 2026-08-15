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
    // PASSWORD RESET
    // ==========================================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
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
    // PROFESSIONAL PROFILE
    // ==========================================

    profile: {
      bio: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        maxlength: 20,
        default: "",
      },

      location: {
        type: String,
        trim: true,
        maxlength: 100,
        default: "",
      },

      education: {
        institution: {
          type: String,
          trim: true,
          maxlength: 150,
          default: "",
        },

        degree: {
          type: String,
          trim: true,
          maxlength: 100,
          default: "",
        },

        fieldOfStudy: {
          type: String,
          trim: true,
          maxlength: 100,
          default: "",
        },

        graduationYear: {
          type: Number,
          default: null,
        },
      },

      skills: {
        type: [String],
        default: [],
      },

      github: {
        type: String,
        trim: true,
        maxlength: 250,
        default: "",
      },

      linkedin: {
        type: String,
        trim: true,
        maxlength: 250,
        default: "",
      },

      portfolio: {
        type: String,
        trim: true,
        maxlength: 250,
        default: "",
      },

      avatar: {
        type: String,
        trim: true,
        default: "",
      },
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

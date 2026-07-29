const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    personalInfo: {
      fullName: {
        type: String,
        trim: true,
        default: "",
      },

      email: {
        type: String,
        trim: true,
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      location: {
        type: String,
        trim: true,
        default: "",
      },

      linkedIn: {
        type: String,
        trim: true,
        default: "",
      },

      github: {
        type: String,
        trim: true,
        default: "",
      },

      portfolio: {
        type: String,
        trim: true,
        default: "",
      },
    },

    summary: {
      type: String,
      trim: true,
      default: "",
    },

    education: [
      {
        institution: {
          type: String,
          trim: true,
          default: "",
        },

        degree: {
          type: String,
          trim: true,
          default: "",
        },

        fieldOfStudy: {
          type: String,
          trim: true,
          default: "",
        },

        startYear: {
          type: String,
          trim: true,
          default: "",
        },

        endYear: {
          type: String,
          trim: true,
          default: "",
        },

        grade: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    skills: {
      type: [String],
      default: [],
    },

    projects: [
      {
        title: {
          type: String,
          trim: true,
          default: "",
        },

        description: {
          type: String,
          trim: true,
          default: "",
        },

        technologies: {
          type: [String],
          default: [],
        },

        projectLink: {
          type: String,
          trim: true,
          default: "",
        },

        githubLink: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    experience: [
      {
        company: {
          type: String,
          trim: true,
          default: "",
        },

        role: {
          type: String,
          trim: true,
          default: "",
        },

        startDate: {
          type: String,
          trim: true,
          default: "",
        },

        endDate: {
          type: String,
          trim: true,
          default: "",
        },

        description: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    certifications: [
      {
        name: {
          type: String,
          trim: true,
          default: "",
        },

        issuer: {
          type: String,
          trim: true,
          default: "",
        },

        date: {
          type: String,
          trim: true,
          default: "",
        },

        credentialLink: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    achievements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", resumeSchema);

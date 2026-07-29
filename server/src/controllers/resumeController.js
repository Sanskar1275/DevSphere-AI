const Resume = require("../models/Resume");
const User = require("../models/User");

// ==========================================
// GET MY RESUME
// ==========================================

const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.user.id,
    }).populate("user", "fullName email");

    // No resume yet is a valid state
    if (!resume) {
      return res.status(200).json({
        success: true,
        exists: false,
        resume: null,
      });
    }

    return res.status(200).json({
      success: true,
      exists: true,
      resume,
    });
  } catch (error) {
    console.error("Get Resume Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load resume",
    });
  }
};

// ==========================================
// CREATE OR UPDATE MY RESUME
// ==========================================

const saveMyResume = async (req, res) => {
  try {
    const {
      personalInfo,
      summary,
      education,
      skills,
      projects,
      experience,
      certifications,
      achievements,
    } = req.body;

    // ========================================
    // GET LOGGED-IN USER
    // ========================================

    const user = await User.findById(req.user.id).select("fullName email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ========================================
    // CLEAN PERSONAL INFO
    // ========================================

    const cleanPersonalInfo = {
      fullName: personalInfo?.fullName?.trim() || user.fullName || "",

      email: personalInfo?.email?.trim() || user.email || "",

      phone: personalInfo?.phone?.trim() || "",

      location: personalInfo?.location?.trim() || "",

      linkedIn: personalInfo?.linkedIn?.trim() || "",

      github: personalInfo?.github?.trim() || "",

      portfolio: personalInfo?.portfolio?.trim() || "",
    };

    // ========================================
    // CLEAN SKILLS
    // ========================================

    const cleanSkills = Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [];

    // Remove duplicate skills
    const uniqueSkills = [...new Set(cleanSkills)];

    // ========================================
    // CLEAN ACHIEVEMENTS
    // ========================================

    const cleanAchievements = Array.isArray(achievements)
      ? achievements
          .map((achievement) => String(achievement).trim())
          .filter(Boolean)
      : [];

    // ========================================
    // RESUME DATA
    // ========================================

    const resumeData = {
      personalInfo: cleanPersonalInfo,

      summary: typeof summary === "string" ? summary.trim() : "",

      education: Array.isArray(education) ? education : [],

      skills: uniqueSkills,

      projects: Array.isArray(projects) ? projects : [],

      experience: Array.isArray(experience) ? experience : [],

      certifications: Array.isArray(certifications) ? certifications : [],

      achievements: cleanAchievements,
    };

    // ========================================
    // CREATE OR UPDATE
    // ========================================

    const resume = await Resume.findOneAndUpdate(
      {
        user: req.user.id,
      },
      {
        $set: resumeData,
        $setOnInsert: {
          user: req.user.id,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Resume saved successfully",
      resume,
    });
  } catch (error) {
    console.error("Save Resume Error:", error.message);

    // Protect against duplicate user resume
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A resume already exists for this user",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save resume",
    });
  }
};

// ==========================================
// DELETE MY RESUME
// ==========================================

const deleteMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete resume",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getMyResume,
  saveMyResume,
  deleteMyResume,
};

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const Application = require("../models/Application");
const Interview = require("../models/Interview");
const Job = require("../models/Job");

// ==========================================
// GOOGLE CLIENT
// ==========================================

const googleClient = new OAuth2Client();

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      if (existingUser.authProvider === "google") {
        return res.status(400).json({
          success: false,
          message:
            "This email is already registered with Google. Please continue with Google.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        notifications: user.notifications,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Google-only account
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GOOGLE LOGIN
// ==========================================

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // ======================================
    // VALIDATE GOOGLE CREDENTIAL
    // ======================================

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is missing");

      return res.status(500).json({
        success: false,
        message: "Google authentication is not configured",
      });
    }

    // ======================================
    // VERIFY GOOGLE ID TOKEN
    // ======================================

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google credential",
      });
    }

    // ======================================
    // GOOGLE USER INFORMATION
    // ======================================

    const googleId = payload.sub;
    const email = payload.email?.toLowerCase().trim();
    const fullName =
      payload.name ||
      `${payload.given_name || ""} ${payload.family_name || ""}`.trim() ||
      "DevSphere User";

    const emailVerified = payload.email_verified;

    // ======================================
    // BASIC GOOGLE VALIDATION
    // ======================================

    if (!googleId || !email) {
      return res.status(401).json({
        success: false,
        message: "Google account information is incomplete",
      });
    }

    if (!emailVerified) {
      return res.status(401).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    // ======================================
    // FIND USER BY GOOGLE ID
    // ======================================

    let user = await User.findOne({
      googleId,
    });

    // ======================================
    // IF GOOGLE ACCOUNT DOESN'T EXIST,
    // CHECK EMAIL
    // ======================================

    if (!user) {
      user = await User.findOne({
        email,
      });
    }

    // ======================================
    // EXISTING USER
    // ======================================

    if (user) {
      // ------------------------------------
      // LINK GOOGLE TO EXISTING ACCOUNT
      // ------------------------------------

      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";

        // Keep existing name if user already
        // customized it.
        if (!user.fullName) {
          user.fullName = fullName;
        }

        await user.save();
      }
    }

    // ======================================
    // NEW GOOGLE USER
    // ======================================

    if (!user) {
      user = await User.create({
        fullName,
        email,
        password: null,
        googleId,
        authProvider: "google",
        role: "student",
      });
    }

    // ======================================
    // GENERATE DEVSPHERE JWT
    // ======================================

    const token = generateToken(user._id, user.role);

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message: "Google Login Successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

// ==========================================
// GET PROFILE
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Google account without a password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In and does not have a password yet.",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE NOTIFICATIONS
// ==========================================

const updateNotifications = async (req, res) => {
  try {
    const { emailNotifications, interviewNotifications, jobRecommendations } =
      req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.notifications = {
      emailNotifications:
        typeof emailNotifications === "boolean"
          ? emailNotifications
          : (user.notifications?.emailNotifications ?? true),

      interviewNotifications:
        typeof interviewNotifications === "boolean"
          ? interviewNotifications
          : (user.notifications?.interviewNotifications ?? true),

      jobRecommendations:
        typeof jobRecommendations === "boolean"
          ? jobRecommendations
          : (user.notifications?.jobRecommendations ?? true),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      notifications: user.notifications,
    });
  } catch (error) {
    console.error("Update notifications error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE ACCOUNT
// ==========================================

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete applications
    await Application.deleteMany({
      user: userId,
    });

    // Delete interviews
    await Interview.deleteMany({
      user: userId,
    });

    // Detach user from jobs
    await Job.updateMany(
      {
        postedBy: userId,
      },
      {
        $set: {
          postedBy: null,
        },
      },
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account. Please try again.",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
  deleteAccount,
};

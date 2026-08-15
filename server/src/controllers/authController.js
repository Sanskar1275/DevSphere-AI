const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const Application = require("../models/Application");
const Interview = require("../models/Interview");
const Job = require("../models/Job");

// ==========================================
// GOOGLE CLIENT
// ==========================================

const googleClient = new OAuth2Client();

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const emailTransporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // ======================================
    // NORMALIZE EMAIL
    // ======================================

    const normalizedEmail = email.toLowerCase().trim();

    // ======================================
    // CHECK EXISTING USER
    // ======================================

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

    // ======================================
    // HASH PASSWORD
    // ======================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ======================================
    // CREATE USER
    // ======================================

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
    });

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        profile: user.profile,
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

    // ======================================
    // VALIDATION
    // ======================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ======================================
    // NORMALIZE EMAIL
    // ======================================

    const normalizedEmail = email.toLowerCase().trim();

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ======================================
    // GOOGLE-ONLY ACCOUNT
    // ======================================

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    // ======================================
    // COMPARE PASSWORD
    // ======================================

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ======================================
    // GENERATE JWT
    // ======================================

    const token = generateToken(user._id, user.role);

    // ======================================
    // RESPONSE
    // ======================================

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
        profile: user.profile,
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
    // VALIDATE CREDENTIAL
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
    // IF NOT FOUND, CHECK EMAIL
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
      // LINK GOOGLE ACCOUNT
      // ------------------------------------

      if (!user.googleId) {
        user.googleId = googleId;

        user.authProvider = "google";

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
    // GENERATE JWT
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
        profile: user.profile,
        notifications: user.notifications,
        createdAt: user.createdAt,
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
// FORGOT PASSWORD
// ==========================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // ======================================
    // PREVENT EMAIL ENUMERATION
    // ======================================

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // ======================================
    // GOOGLE-ONLY ACCOUNT
    // ======================================

    if (!user.password) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // ======================================
    // GENERATE SECURE RESET TOKEN
    // ======================================

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token valid for 15 minutes
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // ======================================
    // RESET URL
    // ======================================

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // ======================================
    // SEND EMAIL
    // ======================================

    await emailTransporter.sendMail({
      from: `"DevSphere AI" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject: "Reset Your DevSphere AI Password",

      html: `
        <!DOCTYPE html>

        <html>
          <body style="
            margin:0;
            padding:0;
            background:#020617;
            font-family:Arial,sans-serif;
            color:#ffffff;
          ">

            <div style="
              max-width:600px;
              margin:40px auto;
              background:#0f172a;
              border:1px solid #1e293b;
              border-radius:20px;
              padding:40px;
            ">

              <h1 style="
                color:#22d3ee;
                margin-bottom:10px;
              ">
                DevSphere AI
              </h1>

              <h2>
                Reset Your Password
              </h2>

              <p style="
                color:#94a3b8;
                line-height:1.7;
              ">
                Hi ${user.fullName},
              </p>

              <p style="
                color:#cbd5e1;
                line-height:1.7;
              ">
                We received a request to reset
                your DevSphere AI password.
              </p>

              <div style="
                text-align:center;
                margin:35px 0;
              ">

                <a
                  href="${resetUrl}"
                  style="
                    display:inline-block;
                    background:#06b6d4;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:10px;
                    font-weight:bold;
                  "
                >
                  Reset Password
                </a>

              </div>

              <p style="
                color:#94a3b8;
                line-height:1.7;
              ">
                This link will expire in
                <strong>15 minutes</strong>.
              </p>

              <p style="
                color:#64748b;
                font-size:13px;
                line-height:1.6;
              ">
                If you didn't request a password
                reset, you can safely ignore this
                email.
              </p>

            </div>

          </body>
        </html>
      `,
    });

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request. Please try again.",
    });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is required",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // ======================================
    // HASH RESET TOKEN
    // ======================================

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // ======================================
    // FIND VALID USER
    // ======================================

    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset link is invalid or has expired",
      });
    }

    // ======================================
    // HASH NEW PASSWORD
    // ======================================

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // ======================================
    // AUTH PROVIDER
    // ======================================

    if (user.googleId) {
      user.authProvider = "google";
    } else {
      user.authProvider = "local";
    }

    // ======================================
    // INVALIDATE RESET TOKEN
    // ======================================

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again.",
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
// UPDATE PROFESSIONAL PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      bio,
      phone,
      location,
      education,
      skills,
      github,
      linkedin,
      portfolio,
      avatar,
    } = req.body;

    // ======================================
    // VALIDATE FULL NAME
    // ======================================

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name must contain at least 2 characters",
      });
    }

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // UPDATE BASIC INFORMATION
    // ======================================

    user.fullName = fullName.trim();

    // ======================================
    // CURRENT PROFILE DATA
    // ======================================

    const currentProfile = user.profile || {};

    const currentEducation = currentProfile.education || {};

    // ======================================
    // CLEAN SKILLS
    // ======================================

    let cleanedSkills = currentProfile.skills || [];

    if (Array.isArray(skills)) {
      cleanedSkills = [
        ...new Set(
          skills
            .filter((skill) => typeof skill === "string" && skill.trim())
            .map((skill) => skill.trim()),
        ),
      ];
    }

    // ======================================
    // EDUCATION
    // ======================================

    const updatedEducation = {
      institution:
        typeof education?.institution === "string"
          ? education.institution.trim()
          : currentEducation.institution || "",

      degree:
        typeof education?.degree === "string"
          ? education.degree.trim()
          : currentEducation.degree || "",

      fieldOfStudy:
        typeof education?.fieldOfStudy === "string"
          ? education.fieldOfStudy.trim()
          : currentEducation.fieldOfStudy || "",

      graduationYear: education?.graduationYear
        ? Number(education.graduationYear)
        : currentEducation.graduationYear || null,
    };

    // ======================================
    // VALIDATE GRADUATION YEAR
    // ======================================

    if (
      updatedEducation.graduationYear !== null &&
      (!Number.isInteger(updatedEducation.graduationYear) ||
        updatedEducation.graduationYear < 1900 ||
        updatedEducation.graduationYear > 2100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid graduation year",
      });
    }

    // ======================================
    // UPDATE PROFESSIONAL PROFILE
    // ======================================

    user.profile = {
      bio: typeof bio === "string" ? bio.trim() : currentProfile.bio || "",

      phone:
        typeof phone === "string" ? phone.trim() : currentProfile.phone || "",

      location:
        typeof location === "string"
          ? location.trim()
          : currentProfile.location || "",

      education: updatedEducation,

      skills: cleanedSkills,

      github:
        typeof github === "string"
          ? github.trim()
          : currentProfile.github || "",

      linkedin:
        typeof linkedin === "string"
          ? linkedin.trim()
          : currentProfile.linkedin || "",

      portfolio:
        typeof portfolio === "string"
          ? portfolio.trim()
          : currentProfile.portfolio || "",

      avatar:
        typeof avatar === "string"
          ? avatar.trim()
          : currentProfile.avatar || "",
    };

    // ======================================
    // SAVE USER
    // ======================================

    await user.save();

    // ======================================
    // RESPONSE
    // ======================================

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

    // ======================================
    // VALIDATION
    // ======================================

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

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // GOOGLE ACCOUNT
    // ======================================

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In and does not have a password yet.",
      });
    }

    // ======================================
    // VERIFY CURRENT PASSWORD
    // ======================================

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // ======================================
    // HASH NEW PASSWORD
    // ======================================

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    // ======================================
    // RESPONSE
    // ======================================

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

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // UPDATE NOTIFICATIONS
    // ======================================

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

    // ======================================
    // RESPONSE
    // ======================================

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

    // ======================================
    // VERIFY USER
    // ======================================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // DELETE APPLICATIONS
    // ======================================

    await Application.deleteMany({
      user: userId,
    });

    // ======================================
    // DELETE INTERVIEWS
    // ======================================

    await Interview.deleteMany({
      user: userId,
    });

    // ======================================
    // DETACH USER FROM JOBS
    // ======================================

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

    // ======================================
    // DELETE USER
    // ======================================

    await User.findByIdAndDelete(userId);

    // ======================================
    // RESPONSE
    // ======================================

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
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
  deleteAccount,
};

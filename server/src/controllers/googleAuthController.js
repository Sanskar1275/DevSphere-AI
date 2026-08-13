const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// GOOGLE LOGIN / REGISTER
// ==========================================

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // ======================================
    // VERIFY GOOGLE TOKEN
    // ======================================

    const ticket = await client.verifyIdToken({
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

    const { sub, email, name, email_verified } = payload;

    if (!email || !email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google email could not be verified",
      });
    }

    // ======================================
    // FIND EXISTING USER
    // ======================================

    let user = await User.findOne({
      email: email.toLowerCase(),
    });

    // ======================================
    // CREATE USER IF NOT EXISTS
    // ======================================

    if (!user) {
      user = await User.create({
        fullName: name || "Google User",

        email: email.toLowerCase(),

        // Google-authenticated users don't
        // use this password for login.
        password: `GOOGLE_${sub}_${Date.now()}`,

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
      message: "Google authentication successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

module.exports = {
  googleAuth,
};

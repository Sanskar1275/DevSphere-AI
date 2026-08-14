const express = require("express");

const router = express.Router();

// ==========================================
// CONTROLLERS
// ==========================================

const {
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
} = require("../controllers/authController");

// ==========================================
// MIDDLEWARE
// ==========================================

const protect = require("../middlewares/authMiddleware");

// ==========================================
// AUTH ROUTES
// ==========================================

// Normal registration
router.post("/register", registerUser);

// Normal login
router.post("/login", loginUser);

// Google Login / Register
router.post("/google", googleLogin);

// ==========================================
// PROFILE
// ==========================================

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

// ==========================================
// SECURITY
// ==========================================

// Change password
router.put("/change-password", protect, changePassword);

// ==========================================
// NOTIFICATIONS
// ==========================================

// Update notification preferences
router.put("/notifications", protect, updateNotifications);

// ==========================================
// ACCOUNT
// ==========================================

// Delete account
router.delete("/account", protect, deleteAccount);

module.exports = router;

// ==========================================
// PASSWORD RESET
// ==========================================

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

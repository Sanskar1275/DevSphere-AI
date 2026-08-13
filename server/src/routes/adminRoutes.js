const express = require("express");

const router = express.Router();

const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

router.get(
  "/stats",
  protect,
  adminOnly,
  getAdminStats
);

// ==========================================
// USER MANAGEMENT
// ==========================================

// Get all users
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

// Update user role
router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

// Delete user
router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports = router;
const express = require("express");

const router = express.Router();

const { getAdminStats } = require("../controllers/adminDashboardController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

router.get("/stats", protect, adminOnly, getAdminStats);

module.exports = router;

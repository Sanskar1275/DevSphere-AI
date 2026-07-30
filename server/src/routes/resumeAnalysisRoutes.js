const express = require("express");

const router = express.Router();

const { analyzeResume } = require("../controllers/resumeAnalysisController");

const protect = require("../middlewares/authMiddleware");

// ==========================================
// ANALYZE LOGGED-IN USER'S RESUME
// GET /api/resume-analysis
// ==========================================

router.get("/", protect, analyzeResume);

module.exports = router;

const express = require("express");

const router = express.Router();

const {
  getRecommendedJobs,
} = require("../controllers/jobRecommendationController");

const protect = require("../middlewares/authMiddleware");

// ==========================================
// GET PERSONALIZED JOB RECOMMENDATIONS
// GET /api/job-recommendations
// ==========================================

router.get("/", protect, getRecommendedJobs);

module.exports = router;

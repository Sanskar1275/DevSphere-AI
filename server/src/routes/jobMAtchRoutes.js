const express = require("express");

const router = express.Router();

const { matchResumeWithJob } = require("../controllers/jobMatchController");

const protect = require("../middlewares/authMiddleware");

// ==========================================
// MATCH RESUME WITH A JOB
// GET /api/job-match/:jobId
// ==========================================

router.get("/:jobId", protect, matchResumeWithJob);

module.exports = router;

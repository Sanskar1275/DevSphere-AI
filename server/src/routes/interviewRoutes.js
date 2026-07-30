const express = require("express");

const router = express.Router();

const {
  startInterview,
  getInterview,
} = require("../controllers/interviewController");

const authMiddleware = require("../middlewares/authMiddleware");

// ==========================================
// START INTERVIEW
// POST /api/interviews/start/:jobId
// ==========================================

router.post("/start/:jobId", authMiddleware, startInterview);

// ==========================================
// GET INTERVIEW
// GET /api/interviews/:id
// ==========================================

router.get("/:id", authMiddleware, getInterview);

module.exports = router;

const express = require("express");

const router = express.Router();

const {
  startInterview,
  getInterview,
  submitInterview,
  getInterviewHistory,
} = require("../controllers/interviewController");

const authMiddleware = require("../middlewares/authMiddleware");

// ==========================================
// START INTERVIEW
// ==========================================

router.post("/start/:jobId", authMiddleware, startInterview);

// ==========================================
// GET INTERVIEW
// ==========================================

router.get("/:id", authMiddleware, getInterview);

// ==========================================
// SUBMIT INTERVIEW
// ==========================================

router.post("/submit/:id", authMiddleware, submitInterview);

// ==========================================
// INTERVIEW HISTORY
// ==========================================

router.get(
  "/history",
  authMiddleware,
  getInterviewHistory
);


module.exports = router;

const express = require("express");

const router = express.Router();

const {
  getMyResume,
  saveMyResume,
  deleteMyResume,
} = require("../controllers/resumeController");

const protect = require("../middlewares/authMiddleware");

// ==========================================
// GET MY RESUME
// GET /api/resume
// ==========================================

router.get("/", protect, getMyResume);

// ==========================================
// CREATE / UPDATE MY RESUME
// PUT /api/resume
// ==========================================

router.put("/", protect, saveMyResume);

// ==========================================
// DELETE MY RESUME
// DELETE /api/resume
// ==========================================

router.delete("/", protect, deleteMyResume);

module.exports = router;

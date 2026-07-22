const express = require("express");

const router = express.Router();

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// ==========================================
// JOB READ ROUTES
// ==========================================

// Get all jobs
router.get("/", getJobs);

// Get single job
router.get("/:id", getJobById);

// ==========================================
// ADMIN JOB ROUTES
// ==========================================

// Create job
router.post("/", protect, adminOnly, createJob);

// Update job
router.put("/:id", protect, adminOnly, updateJob);

// Delete job
router.delete("/:id", protect, adminOnly, deleteJob);

module.exports = router;

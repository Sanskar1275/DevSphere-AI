const express = require("express");

const router = express.Router();

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require(
  "../controllers/jobController"
);

// Get all jobs
router.get("/", getJobs);

// Get single job
router.get("/:id", getJobById);

// Create new job
router.post("/", createJob);

// Update job
router.put("/:id", updateJob);

// Delete job
router.delete("/:id", deleteJob);

module.exports = router;
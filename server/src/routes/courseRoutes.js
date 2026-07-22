const express = require("express");

const router = express.Router();

const {
  getCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// ==========================================
// COURSE READ ROUTES
// ==========================================

// Get all courses
router.get("/", getCourses);

// Get single course
router.get("/:id", getCourseById);

// ==========================================
// ADMIN COURSE ROUTES
// ==========================================

// Create course
router.post("/", protect, adminOnly, createCourse);

// Update course
router.put("/:id", protect, adminOnly, updateCourse);

// Delete course
router.delete("/:id", protect, adminOnly, deleteCourse);

module.exports = router;

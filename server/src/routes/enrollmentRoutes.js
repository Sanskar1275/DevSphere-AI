const express = require("express");

const router = express.Router();

const {
  enrollInCourse,
  checkEnrollment,
  completeLesson,
  getUserEnrollments,
} = require("../controllers/enrollmentController");

// Enroll in course
router.post("/", enrollInCourse);

// Check enrollment
router.get("/check/:userId/:courseId", checkEnrollment);

// Mark lesson as complete
router.patch("/complete-lesson", completeLesson);

router.get("/user/:userId", getUserEnrollments);

module.exports = router;

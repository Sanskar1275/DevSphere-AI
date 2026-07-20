const express = require("express");

const router = express.Router();

const {
  enrollInCourse,
  checkEnrollment,
} = require("../controllers/enrollmentController");

// ENROLL USER IN A COURSE
router.post(
  "/",
  enrollInCourse
);

// CHECK IF USER IS ENROLLED IN A COURSE
router.get(
  "/check/:userId/:courseId",
  checkEnrollment
);

module.exports = router;
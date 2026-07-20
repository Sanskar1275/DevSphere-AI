const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ==========================================
// ENROLL USER IN A COURSE
// ==========================================

const enrollInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Validate input
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message:
          "User ID and Course ID are required",
      });
    }

    // Check if course exists
    const course = await Course.findById(
      courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is already enrolled
    const existingEnrollment =
      await Enrollment.findOne({
        user: userId,
        course: courseId,
      });

    if (existingEnrollment) {
      return res.status(200).json({
        success: true,
        message:
          "User is already enrolled in this course",
        enrollment: existingEnrollment,
      });
    }

    // Create new enrollment
    const enrollment =
      await Enrollment.create({
        user: userId,
        course: courseId,
      });

    res.status(201).json({
      success: true,
      message:
        "Enrolled in course successfully",
      enrollment,
    });
  } catch (error) {
    console.error(
      "Enrollment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to enroll in course",
    });
  }
};


// ==========================================
// CHECK COURSE ENROLLMENT STATUS
// ==========================================

const checkEnrollment = async (req, res) => {
  try {
    const {
      userId,
      courseId,
    } = req.params;

    // Validate input
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message:
          "User ID and Course ID are required",
      });
    }

    // Find enrollment
    const enrollment =
      await Enrollment.findOne({
        user: userId,
        course: courseId,
      });

    // User is not enrolled
    if (!enrollment) {
      return res.status(200).json({
        success: true,
        enrolled: false,
        enrollment: null,
      });
    }

    // User is enrolled
    res.status(200).json({
      success: true,
      enrolled: true,
      enrollment,
    });
  } catch (error) {
    console.error(
      "Check Enrollment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to check enrollment",
    });
  }
};


module.exports = {
  enrollInCourse,
  checkEnrollment,
};
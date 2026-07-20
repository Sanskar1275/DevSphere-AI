const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// =========================================
// ENROLL USER IN A COURSE
// =========================================

const enrollInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Course ID are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(200).json({
        success: true,
        message: "User is already enrolled in this course",
        enrollment: existingEnrollment,
      });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Enrolled in course successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to enroll in course",
    });
  }
};

// =========================================
// CHECK ENROLLMENT
// =========================================

const checkEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(200).json({
        success: true,
        enrolled: false,
        enrollment: null,
      });
    }

    res.status(200).json({
      success: true,
      enrolled: true,
      enrollment,
    });
  } catch (error) {
    console.error("Check Enrollment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to check enrollment",
    });
  }
};

// =========================================
// COMPLETE LESSON
// =========================================

const completeLesson = async (req, res) => {
  try {
    const { userId, courseId, lessonIndex } = req.body;

    if (!userId || !courseId || lessonIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID, Course ID and lesson index are required",
      });
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const totalLessons = course.curriculum?.length || 0;

    if (totalLessons === 0) {
      return res.status(400).json({
        success: false,
        message: "Course has no lessons",
      });
    }

    // Validate lesson index
    if (lessonIndex < 0 || lessonIndex >= totalLessons) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson index",
      });
    }

    // Add lesson only if not already completed
    if (!enrollment.completedLessons.includes(lessonIndex)) {
      enrollment.completedLessons.push(lessonIndex);
    }

    // Calculate progress
    const completedCount = enrollment.completedLessons.length;

    enrollment.progress = Math.round((completedCount / totalLessons) * 100);

    enrollment.lastAccessedAt = new Date();

    // Course completed
    if (enrollment.progress === 100) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Lesson completed successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Complete Lesson Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to complete lesson",
    });
  }
};

// =========================================
// GET USER ENROLLMENTS
// =========================================

const getUserEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const enrollments = await Enrollment.find({
      user: userId,
    });

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error("Get User Enrollments Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get user enrollments",
    });
  }
};

module.exports = {
  enrollInCourse,
  checkEnrollment,
  completeLesson,
  getUserEnrollments,
};

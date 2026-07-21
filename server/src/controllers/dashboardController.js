const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Job = require("../models/Job");

// =========================================
// GET USER DASHBOARD
// =========================================

const getDashboard = async (req, res) => {
  try {
    // =========================================
    // GET CURRENT USER
    // =========================================

    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================================
    // GET USER ENROLLMENTS
    // =========================================

    const enrollments = await Enrollment.find({
      user: req.user.id,
    })
      .populate(
        "course",
        "title description category level lessons duration thumbnail instructor"
      )
      .sort({
        lastAccessedAt: -1,
      });

    // Remove enrollments whose course
    // may have been deleted
    const validEnrollments =
      enrollments.filter(
        (enrollment) =>
          enrollment.course
      );

    // =========================================
    // DASHBOARD STATISTICS
    // =========================================

    const enrolledCourses =
      validEnrollments.length;

    const completedLessons =
      validEnrollments.reduce(
        (total, enrollment) => {
          return (
            total +
            (
              enrollment.completedLessons ||
              []
            ).length
          );
        },
        0
      );

    const averageProgress =
      enrolledCourses > 0
        ? Math.round(
            validEnrollments.reduce(
              (total, enrollment) =>
                total +
                (enrollment.progress || 0),
              0
            ) / enrolledCourses
          )
        : 0;

    const completedCourses =
      validEnrollments.filter(
        (enrollment) =>
          enrollment.progress >= 100
      ).length;

    // =========================================
    // CONTINUE LEARNING
    // =========================================

    const continueLearning =
      validEnrollments
        .filter(
          (enrollment) =>
            enrollment.progress < 100
        )
        .slice(0, 3)
        .map((enrollment) => ({
          enrollmentId:
            enrollment._id,

          courseId:
            enrollment.course._id,

          title:
            enrollment.course.title,

          description:
            enrollment.course.description,

          category:
            enrollment.course.category,

          level:
            enrollment.course.level,

          lessons:
            enrollment.course.lessons,

          duration:
            enrollment.course.duration,

          thumbnail:
            enrollment.course.thumbnail,

          instructor:
            enrollment.course.instructor,

          progress:
            enrollment.progress || 0,

          completedLessons:
            enrollment.completedLessons ||
            [],

          lastAccessedAt:
            enrollment.lastAccessedAt,
        }));

    // =========================================
    // RECOMMENDED COURSES
    // =========================================

    const enrolledCourseIds =
      validEnrollments.map(
        (enrollment) =>
          enrollment.course._id
      );

    const recommendedCourses =
      await Course.find({
        _id: {
          $nin: enrolledCourseIds,
        },
      })
        .sort({
          createdAt: -1,
        })
        .limit(3)
        .select(
          "title description category level lessons duration rating thumbnail instructor"
        );

    // =========================================
    // LATEST JOBS
    // =========================================

    const latestJobs =
      await Job.find()
        .sort({
          createdAt: -1,
        })
        .limit(3)
        .select(
          "title company location jobType workMode experience salary skills createdAt"
        );

    // =========================================
    // RECENT ACTIVITY
    // =========================================

    const recentActivity =
      validEnrollments
        .slice(0, 5)
        .map((enrollment) => ({
          courseId:
            enrollment.course._id,

          title:
            enrollment.course.title,

          progress:
            enrollment.progress || 0,

          completedLessons:
            (
              enrollment.completedLessons ||
              []
            ).length,

          lastAccessedAt:
            enrollment.lastAccessedAt,
        }));

    // =========================================
    // RESPONSE
    // =========================================

    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },

      stats: {
        enrolledCourses,
        completedLessons,
        averageProgress,
        completedCourses,
      },

      continueLearning,

      recommendedCourses,

      latestJobs,

      recentActivity,
    });
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to load dashboard",
    });
  }
};

module.exports = {
  getDashboard,
};
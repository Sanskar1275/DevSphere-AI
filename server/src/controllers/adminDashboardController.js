const Course = require("../models/Course");
const User = require("../models/User");
const Job = require("../models/Job");
const Enrollment = require("../models/Enrollment");

// GET ADMIN DASHBOARD STATISTICS
const getAdminStats = async (req, res) => {
  try {
    const [
      totalCourses,
      totalUsers,
      totalJobs,
      totalEnrollments,
    ] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments(),
      Job.countDocuments(),
      Enrollment.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalUsers,
        totalJobs,
        totalEnrollments,
      },
    });
  } catch (error) {
    console.error(
      "Admin Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to load admin dashboard statistics",
    });
  }
};

module.exports = {
  getAdminStats,
};
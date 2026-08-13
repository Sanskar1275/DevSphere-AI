const Course = require("../models/Course");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

// ==========================================
// GET ADMIN DASHBOARD STATISTICS
// ==========================================

const getAdminStats = async (req, res) => {
  try {
    // ======================================
    // USER STATISTICS
    // ======================================

    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalRecruiters = await User.countDocuments({
      role: "recruiter",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    // ======================================
    // COURSE STATISTICS
    // ======================================

    const totalCourses = await Course.countDocuments();

    const publishedCourses = totalCourses;

    // ======================================
    // COURSE RATING
    // ======================================

    const ratings = await Course.find().select("rating").lean();

    const validRatings = ratings
      .map((course) => Number(course.rating))
      .filter((rating) => !Number.isNaN(rating) && rating >= 0);

    const averageRating =
      validRatings.length === 0
        ? 0
        : Number(
            (
              validRatings.reduce((sum, rating) => sum + rating, 0) /
              validRatings.length
            ).toFixed(1),
          );

    // ======================================
    // JOB STATISTICS
    // ======================================

    const totalJobs = await Job.countDocuments();

    const activeJobs = await Job.countDocuments({
      isActive: true,
    });

    // ======================================
    // APPLICATION STATISTICS
    // ======================================

    const totalApplications = await Application.countDocuments();

    // ======================================
    // INTERVIEW STATISTICS
    // ======================================

    const totalInterviews = await Interview.countDocuments();

    const completedInterviews = await Interview.countDocuments({
      status: "Completed",
    });

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalAdmins,

        totalCourses,
        publishedCourses,
        averageRating,

        totalJobs,
        activeJobs,

        totalApplications,

        totalInterviews,
        completedInterviews,
      },
    });
  } catch (error) {
    console.error("Failed to load admin statistics:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin statistics",
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const { search = "", role = "all" } = req.query;

    // ======================================
    // BUILD QUERY
    // ======================================

    const query = {};

    // Search by name or email
    if (search.trim()) {
      query.$or = [
        {
          fullName: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Filter by role
    if (role && role !== "all") {
      query.role = role;
    }

    // ======================================
    // FETCH USERS
    // ======================================

    const users = await User.find(query)
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .lean();

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

// ==========================================
// UPDATE USER ROLE
// ==========================================

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // ======================================
    // VALIDATE ROLE
    // ======================================

    const allowedRoles = ["student", "recruiter", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // ======================================
    // PREVENT SELF ROLE CHANGE
    // ======================================

    if (String(id) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // UPDATE ROLE
    // ======================================

    user.role = role;

    await user.save();

    // ======================================
    // RESPONSE
    // ======================================

    const updatedUser = await User.findById(id).select("-password").lean();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ======================================
    // PREVENT SELF DELETION
    // ======================================

    if (String(id) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account from the admin panel",
      });
    }

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // DELETE APPLICATIONS
    // ======================================

    await Application.deleteMany({
      user: id,
    });

    // ======================================
    // DELETE INTERVIEWS
    // ======================================

    await Interview.deleteMany({
      user: id,
    });

    // ======================================
    // DETACH JOBS
    // ======================================

    await Job.updateMany(
      {
        postedBy: id,
      },
      {
        $set: {
          postedBy: null,
        },
      },
    );

    // ======================================
    // DELETE USER
    // ======================================

    await User.findByIdAndDelete(id);

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};

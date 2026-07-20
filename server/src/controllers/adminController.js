const Course = require("../models/Course");
const User = require("../models/User");

const getAdminStats = async (req, res) => {
  try {

    const totalCourses = await Course.countDocuments();

    const totalUsers = await User.countDocuments();

    const ratings = await Course.find().select("rating");

    const averageRating =
      ratings.length === 0
        ? 0
        : (
            ratings.reduce(
              (sum, item) => sum + item.rating,
              0
            ) / ratings.length
          ).toFixed(1);

    res.json({
      success: true,

      stats: {
        totalCourses,
        totalUsers,
        averageRating,
        publishedCourses: totalCourses,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getAdminStats,
};
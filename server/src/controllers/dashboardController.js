const User = require("../models/User");

const getDashboard = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,

      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },

      stats: {
        courses: 12,
        jobs: 8,
        questions: 145,
        streak: 14,
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
  getDashboard,
};
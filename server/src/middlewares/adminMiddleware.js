const adminOnly = (req, res, next) => {
  try {
    // User must already be authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Authorization Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

module.exports = adminOnly;

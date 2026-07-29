const Application = require("../models/Application");
const Job = require("../models/Job");

// ==========================================
// VALID APPLICATION STATUSES
// ==========================================

const APPLICATION_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
  "Withdrawn",
];

// ==========================================
// APPLY FOR A JOB
// ==========================================

const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    if (
      job.applicationDeadline &&
      new Date(job.applicationDeadline) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "The application deadline has passed",
      });
    }

    const existingApplication = await Application.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      user: req.user.id,
      job: jobId,
      coverLetter: coverLetter?.trim() || "",
    });

    const populatedApplication = await Application.findById(application._id)
      .populate("job", "title company jobType location workMode")
      .populate("user", "fullName email");

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Apply Job Error:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit application",
    });
  }
};

// ==========================================
// GET LOGGED-IN USER APPLICATIONS
// ==========================================

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user.id,
    })
      .populate(
        "job",
        "title company jobType location workMode salary companyLogo isActive applicationDeadline",
      )
      .sort({
        appliedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load applications",
    });
  }
};

// ==========================================
// GET SINGLE USER APPLICATION
// ==========================================

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate(
        "job",
        "title company description jobType location workMode experience salary skills requirements responsibilities companyLogo applicationDeadline",
      )
      .populate("user", "fullName email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this application",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get Application Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load application",
    });
  }
};

// ==========================================
// WITHDRAW APPLICATION
// ==========================================

const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to withdraw this application",
      });
    }

    if (application.status === "Withdrawn") {
      return res.status(400).json({
        success: false,
        message: "Application is already withdrawn",
      });
    }

    if (
      application.status === "Selected" ||
      application.status === "Rejected"
    ) {
      return res.status(400).json({
        success: false,
        message: "This application can no longer be withdrawn",
      });
    }

    application.status = "Withdrawn";

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      application,
    });
  } catch (error) {
    console.error("Withdraw Application Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to withdraw application",
    });
  }
};

// ==========================================
// ADMIN: GET ALL APPLICATIONS
// ==========================================

const getAllApplications = async (req, res) => {
  try {
    const { status, jobId, search } = req.query;

    const filter = {};

    // Filter by status
    if (status && status !== "All") {
      if (!APPLICATION_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application status",
        });
      }

      filter.status = status;
    }

    // Filter by job
    if (jobId) {
      filter.job = jobId;
    }

    let applications = await Application.find(filter)
      .populate("user", "fullName email role")
      .populate("job", "title company jobType location workMode companyLogo")
      .sort({
        appliedAt: -1,
      });

    // Search student/job/company
    if (search?.trim()) {
      const searchTerm = search.trim().toLowerCase();

      applications = applications.filter((application) => {
        const fullName = application.user?.fullName?.toLowerCase() || "";

        const email = application.user?.email?.toLowerCase() || "";

        const jobTitle = application.job?.title?.toLowerCase() || "";

        const company = application.job?.company?.toLowerCase() || "";

        return (
          fullName.includes(searchTerm) ||
          email.includes(searchTerm) ||
          jobTitle.includes(searchTerm) ||
          company.includes(searchTerm)
        );
      });
    }

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Admin Get Applications Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load applications",
    });
  }
};

// ==========================================
// ADMIN: GET SINGLE APPLICATION
// ==========================================

const getAdminApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("user", "fullName email role createdAt")
      .populate(
        "job",
        "title company description jobType location workMode experience salary skills requirements responsibilities companyLogo isActive applicationDeadline createdAt",
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Admin Get Application Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load application",
    });
  }
};

// ==========================================
// ADMIN: UPDATE APPLICATION STATUS
// ==========================================

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // Withdrawn belongs to the student action,
    // not an admin decision.
    if (status === "Withdrawn") {
      return res.status(400).json({
        success: false,
        message: "Admin cannot mark an application as withdrawn",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Once student withdraws, admin should
    // not continue processing it.
    if (application.status === "Withdrawn") {
      return res.status(400).json({
        success: false,
        message: "A withdrawn application cannot be updated",
      });
    }

    application.status = status;

    await application.save();

    const populatedApplication = await Application.findById(application._id)
      .populate("user", "fullName email role")
      .populate("job", "title company jobType location workMode companyLogo");

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update application status",
    });
  }
};

// ==========================================
// ADMIN: APPLICATION STATISTICS
// ==========================================

const getApplicationStats = async (req, res) => {
  try {
    const [
      total,
      applied,
      underReview,
      shortlisted,
      interview,
      selected,
      rejected,
      withdrawn,
    ] = await Promise.all([
      Application.countDocuments(),

      Application.countDocuments({
        status: "Applied",
      }),

      Application.countDocuments({
        status: "Under Review",
      }),

      Application.countDocuments({
        status: "Shortlisted",
      }),

      Application.countDocuments({
        status: "Interview",
      }),

      Application.countDocuments({
        status: "Selected",
      }),

      Application.countDocuments({
        status: "Rejected",
      }),

      Application.countDocuments({
        status: "Withdrawn",
      }),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        total,
        applied,
        underReview,
        shortlisted,
        interview,
        selected,
        rejected,
        withdrawn,
      },
    });
  } catch (error) {
    console.error("Application Stats Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load application statistics",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  // Student
  applyForJob,
  getMyApplications,
  getApplicationById,
  withdrawApplication,

  // Admin
  getAllApplications,
  getAdminApplicationById,
  updateApplicationStatus,
  getApplicationStats,
};

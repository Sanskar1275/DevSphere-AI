const Job = require("../models/Job");

// =========================================
// GET ALL ACTIVE JOBS
// =========================================

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(
      "Get Jobs Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch jobs",
    });
  }
};

// =========================================
// GET SINGLE JOB BY ID
// =========================================

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(
      "Get Job Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch job",
    });
  }
};

// =========================================
// CREATE JOB
// =========================================

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      jobType,
      location,
      workMode,
      experience,
      salary,
      skills,
      requirements,
      responsibilities,
      applyLink,
      companyLogo,
      postedBy,
      applicationDeadline,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !company ||
      !description ||
      !jobType ||
      !location ||
      !applyLink
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, company, description, job type, location and apply link are required",
      });
    }

    const job = await Job.create({
      title,
      company,
      description,
      jobType,
      location,
      workMode,
      experience,
      salary,
      skills: skills || [],
      requirements:
        requirements || [],
      responsibilities:
        responsibilities || [],
      applyLink,
      companyLogo:
        companyLogo || "",
      postedBy:
        postedBy || null,
      applicationDeadline:
        applicationDeadline || null,
    });

    res.status(201).json({
      success: true,
      message:
        "Job created successfully",
      job,
    });
  } catch (error) {
    console.error(
      "Create Job Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create job",
    });
  }
};

// =========================================
// UPDATE JOB
// =========================================

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job =
      await Job.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error(
      "Update Job Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update job",
    });
  }
};

// =========================================
// DELETE JOB
// =========================================

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job =
      await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Job deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Job Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete job",
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
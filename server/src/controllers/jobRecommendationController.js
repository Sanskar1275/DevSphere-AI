const Resume = require("../models/Resume");
const Job = require("../models/Job");

const { calculateJobMatch } = require("../utils/jobMatcher");

// ==========================================
// GET RECOMMENDED JOBS
// GET /api/job-recommendations
// ==========================================

const getRecommendedJobs = async (req, res) => {
  try {
    // ========================================
    // GET USER RESUME
    // ========================================

    const resume = await Resume.findOne({
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          "Create and save your resume to receive personalized job recommendations.",
      });
    }

    // ========================================
    // GET AVAILABLE JOBS
    // ========================================

    const now = new Date();

    const jobs = await Job.find({
      $and: [
        {
          $or: [
            { isActive: true },
            { isActive: { $exists: false } },
            { isActive: null },
          ],
        },

        {
          $or: [
            {
              applicationDeadline: {
                $exists: false,
              },
            },
            {
              applicationDeadline: null,
            },
            {
              applicationDeadline: {
                $gte: now,
              },
            },
          ],
        },
      ],
    }).sort({
      createdAt: -1,
    });

    // ========================================
    // CALCULATE MATCH FOR EVERY JOB
    // ========================================

    const recommendations = jobs.map((job) => ({
      job: {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        workMode: job.workMode,
        jobType: job.jobType,
        experience: job.experience,
        salary: job.salary,
        companyLogo: job.companyLogo,
        applicationDeadline: job.applicationDeadline,
        createdAt: job.createdAt,
      },

      match: calculateJobMatch(job, resume),
    }));

    // ========================================
    // BEST MATCH FIRST
    // ========================================

    recommendations.sort((a, b) => {
      if (b.match.score !== a.match.score) {
        return b.match.score - a.match.score;
      }

      return new Date(b.job.createdAt) - new Date(a.job.createdAt);
    });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("Job Recommendation Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate job recommendations.",
    });
  }
};

module.exports = {
  getRecommendedJobs,
};

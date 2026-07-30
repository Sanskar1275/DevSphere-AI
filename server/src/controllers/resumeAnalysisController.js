const Resume = require("../models/Resume");

// ==========================================
// ANALYZE RESUME
// ==========================================

const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found. Create your resume first.",
      });
    }

    let score = 0;

    const strengths = [];
    const improvements = [];
    const sectionScores = {};

    // ==========================================
    // PERSONAL INFORMATION
    // 15 POINTS
    // ==========================================

    let personalScore = 0;

    const personal = resume.personalInfo || {};

    if (personal.fullName) personalScore += 3;
    if (personal.email) personalScore += 3;
    if (personal.phone) personalScore += 2;
    if (personal.location) personalScore += 2;
    if (personal.linkedIn) personalScore += 2;
    if (personal.github) personalScore += 2;
    if (personal.portfolio) personalScore += 1;

    sectionScores.personalInfo = personalScore;

    score += personalScore;

    if (personalScore >= 12) {
      strengths.push(
        "Your contact and professional profile information is strong.",
      );
    } else {
      improvements.push(
        "Complete your contact information and add LinkedIn, GitHub, or portfolio links.",
      );
    }

    // ==========================================
    // PROFESSIONAL SUMMARY
    // 10 POINTS
    // ==========================================

    let summaryScore = 0;

    if (resume.summary) {
      const summaryLength = resume.summary.trim().length;

      if (summaryLength >= 100) {
        summaryScore = 10;

        strengths.push(
          "Your professional summary provides a useful introduction.",
        );
      } else if (summaryLength >= 50) {
        summaryScore = 7;

        improvements.push(
          "Expand your professional summary with key skills and career goals.",
        );
      } else {
        summaryScore = 4;

        improvements.push(
          "Your professional summary is too short. Add more detail about your skills and goals.",
        );
      }
    } else {
      improvements.push(
        "Add a professional summary to introduce your profile.",
      );
    }

    sectionScores.summary = summaryScore;

    score += summaryScore;

    // ==========================================
    // EDUCATION
    // 10 POINTS
    // ==========================================

    let educationScore = 0;

    if (resume.education?.length > 0) {
      educationScore = 10;

      strengths.push("Your education information is included clearly.");
    } else {
      improvements.push("Add your educational background.");
    }

    sectionScores.education = educationScore;

    score += educationScore;

    // ==========================================
    // SKILLS
    // 20 POINTS
    // ==========================================

    let skillsScore = 0;

    const skillsCount = resume.skills?.length || 0;

    if (skillsCount >= 8) {
      skillsScore = 20;

      strengths.push("You have a strong technical skills section.");
    } else if (skillsCount >= 5) {
      skillsScore = 15;

      improvements.push("Add a few more relevant technical skills.");
    } else if (skillsCount >= 2) {
      skillsScore = 8;

      improvements.push(
        "Your skills section needs more technologies and tools.",
      );
    } else {
      improvements.push(
        "Add your programming languages, frameworks, databases, and developer tools.",
      );
    }

    sectionScores.skills = skillsScore;

    score += skillsScore;

    // ==========================================
    // PROJECTS
    // 20 POINTS
    // ==========================================

    let projectScore = 0;

    const projectsCount = resume.projects?.length || 0;

    if (projectsCount >= 3) {
      projectScore = 20;

      strengths.push(
        "Your project portfolio demonstrates practical development experience.",
      );
    } else if (projectsCount === 2) {
      projectScore = 15;

      improvements.push(
        "Add one more strong project to improve your portfolio.",
      );
    } else if (projectsCount === 1) {
      projectScore = 8;

      improvements.push(
        "Add more development projects to demonstrate your practical skills.",
      );
    } else {
      improvements.push(
        "Add projects with descriptions, technologies, GitHub links, and live demos.",
      );
    }

    sectionScores.projects = projectScore;

    score += projectScore;

    // ==========================================
    // EXPERIENCE
    // 15 POINTS
    // ==========================================

    let experienceScore = 0;

    const experienceCount = resume.experience?.length || 0;

    if (experienceCount >= 2) {
      experienceScore = 15;

      strengths.push(
        "Your experience section strengthens your professional profile.",
      );
    } else if (experienceCount === 1) {
      experienceScore = 10;

      strengths.push("You have relevant professional experience listed.");

      improvements.push(
        "Add more internships or professional experience as you gain them.",
      );
    } else {
      improvements.push(
        "Add internships, freelance work, volunteering, or relevant professional experience.",
      );
    }

    sectionScores.experience = experienceScore;

    score += experienceScore;

    // ==========================================
    // CERTIFICATIONS
    // 5 POINTS
    // ==========================================

    let certificationScore = 0;

    if (resume.certifications?.length > 0) {
      certificationScore = 5;

      strengths.push(
        "Certifications add credibility to your technical profile.",
      );
    } else {
      improvements.push("Consider adding relevant technical certifications.");
    }

    sectionScores.certifications = certificationScore;

    score += certificationScore;

    // ==========================================
    // ACHIEVEMENTS
    // 5 POINTS
    // ==========================================

    let achievementScore = 0;

    if (resume.achievements?.length > 0) {
      achievementScore = 5;

      strengths.push("Achievements help your resume stand out.");
    } else {
      improvements.push(
        "Add hackathons, competitions, awards, leadership, or notable achievements.",
      );
    }

    sectionScores.achievements = achievementScore;

    score += achievementScore;

    // ==========================================
    // RATING
    // ==========================================

    let rating = "Needs Improvement";

    if (score >= 85) {
      rating = "Excellent";
    } else if (score >= 70) {
      rating = "Strong";
    } else if (score >= 50) {
      rating = "Good";
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      analysis: {
        score,
        rating,
        sectionScores,
        strengths,
        improvements,
      },
    });
  } catch (error) {
    console.error("Resume Analysis Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze resume.",
    });
  }
};

module.exports = {
  analyzeResume,
};

const Resume = require("../models/Resume");
const Job = require("../models/Job");

// ==========================================
// SKILL ALIASES
// ==========================================

const skillAliases = {
  javascript: ["javascript", "js", "javascriptes6", "ecmascript"],

  typescript: ["typescript", "ts"],

  react: ["react", "reactjs", "react.js"],

  nodejs: ["node", "nodejs", "node.js"],

  expressjs: ["express", "expressjs", "express.js"],

  mongodb: ["mongodb", "mongo", "mongo db"],

  mysql: ["mysql", "my sql"],

  postgresql: ["postgresql", "postgres", "psql"],

  html: ["html", "html5"],

  css: ["css", "css3"],

  tailwindcss: ["tailwind", "tailwindcss", "tailwind css"],

  bootstrap: ["bootstrap", "bootstrap5"],

  python: ["python", "python3"],

  java: ["java", "java8", "java17"],

  cpp: ["c++", "cpp"],

  csharp: ["c#", "csharp"],

  git: ["git", "git scm"],

  github: ["github", "git hub"],

  docker: ["docker", "dockerfile"],

  kubernetes: ["kubernetes", "k8s"],

  aws: ["aws", "amazon web services"],

  azure: ["azure", "microsoft azure"],

  firebase: ["firebase", "google firebase"],

  nextjs: ["next", "nextjs", "next.js"],

  vue: ["vue", "vuejs", "vue.js"],

  angular: ["angular", "angularjs"],

  flask: ["flask", "python flask"],

  django: ["django", "python django"],

  restapi: ["rest api", "restapi", "restful api", "rest"],

  graphql: ["graphql", "graph ql"],

  mongoose: ["mongoose", "mongoosejs"],

  redux: ["redux", "redux toolkit", "rtk"],

  vite: ["vite", "vitejs"],

  jwt: ["jwt", "json web token", "json web tokens"],
};

// ==========================================
// CLEAN TEXT
// ==========================================

const cleanSkill = (value = "") => {
  return value.toString().toLowerCase().trim().replace(/\s+/g, " ");
};

// ==========================================
// NORMALIZE SKILL
// Converts aliases to one canonical name
// ==========================================

const normalizeSkill = (value = "") => {
  const cleaned = cleanSkill(value);

  for (const [canonical, aliases] of Object.entries(skillAliases)) {
    const found = aliases.some((alias) => cleanSkill(alias) === cleaned);

    if (found) {
      return canonical;
    }
  }

  return cleaned.replace(/\s+/g, "").replace(/[^\w+#.]/g, "");
};

// ==========================================
// DISPLAY SKILL
// Makes normalized names readable
// ==========================================

const skillDisplayNames = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  nodejs: "Node.js",
  expressjs: "Express.js",
  mongodb: "MongoDB",
  mysql: "MySQL",
  postgresql: "PostgreSQL",
  html: "HTML",
  css: "CSS",
  tailwindcss: "Tailwind CSS",
  bootstrap: "Bootstrap",
  python: "Python",
  java: "Java",
  cpp: "C++",
  csharp: "C#",
  git: "Git",
  github: "GitHub",
  docker: "Docker",
  kubernetes: "Kubernetes",
  aws: "AWS",
  azure: "Microsoft Azure",
  firebase: "Firebase",
  nextjs: "Next.js",
  vue: "Vue.js",
  angular: "Angular",
  flask: "Flask",
  django: "Django",
  restapi: "REST API",
  graphql: "GraphQL",
  mongoose: "Mongoose",
  redux: "Redux",
  vite: "Vite",
  jwt: "JWT",
};

const displaySkill = (skill) => {
  return skillDisplayNames[skill] || skill;
};

// ==========================================
// UNIQUE ARRAY
// ==========================================

const unique = (items = []) => {
  return [...new Set(items)];
};

// ==========================================
// GET RESUME SKILLS
// Includes skills + project technologies
// ==========================================

const getResumeSkills = (resume) => {
  const directSkills = resume.skills || [];

  const projectTechnologies = (resume.projects || []).flatMap(
    (project) => project.technologies || [],
  );

  return unique(
    [...directSkills, ...projectTechnologies]
      .map(normalizeSkill)
      .filter(Boolean),
  );
};

// ==========================================
// GET EXPERIENCE TEXT
// ==========================================

const getExperienceText = (resume) => {
  return (resume.experience || [])
    .map((item) =>
      [item.role, item.company, item.description].filter(Boolean).join(" "),
    )
    .join(" ")
    .toLowerCase();
};

// ==========================================
// MATCH RESUME WITH JOB
// GET /api/job-match/:jobId
// ==========================================

const matchResumeWithJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // ======================================
    // FIND JOB
    // ======================================

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // ======================================
    // FIND RESUME
    // ======================================

    const resume = await Resume.findOne({
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found. Create and save your resume first.",
      });
    }

    // ======================================
    // NORMALIZE JOB SKILLS
    // ======================================

    const jobSkills = unique(
      (job.skills || []).map(normalizeSkill).filter(Boolean),
    );

    // ======================================
    // NORMALIZE RESUME SKILLS
    // ======================================

    const resumeSkills = getResumeSkills(resume);

    const resumeSkillSet = new Set(resumeSkills);

    // ======================================
    // MATCHED / MISSING SKILLS
    // ======================================

    const matchedSkillsNormalized = jobSkills.filter((skill) =>
      resumeSkillSet.has(skill),
    );

    const missingSkillsNormalized = jobSkills.filter(
      (skill) => !resumeSkillSet.has(skill),
    );

    const matchedSkills = matchedSkillsNormalized.map(displaySkill);

    const missingSkills = missingSkillsNormalized.map(displaySkill);

    // ======================================
    // SKILL SCORE
    // Maximum: 70
    // ======================================

    let skillScore = 0;

    if (jobSkills.length > 0) {
      skillScore = Math.round(
        (matchedSkillsNormalized.length / jobSkills.length) * 70,
      );
    } else {
      skillScore = 70;
    }

    // ======================================
    // RELEVANT PROJECTS
    // Maximum: 15
    // ======================================

    const relevantProjects = [];

    (resume.projects || []).forEach((project) => {
      const technologies = unique(
        (project.technologies || []).map(normalizeSkill).filter(Boolean),
      );

      const matchingTechnologies = technologies.filter((technology) =>
        jobSkills.includes(technology),
      );

      if (matchingTechnologies.length > 0) {
        relevantProjects.push({
          title: project.title || "Untitled Project",

          matchedTechnologies: matchingTechnologies.map(displaySkill),
        });
      }
    });

    let projectScore = 0;

    if (relevantProjects.length >= 2) {
      projectScore = 15;
    } else if (relevantProjects.length === 1) {
      projectScore = 10;
    }

    // ======================================
    // EXPERIENCE SCORE
    // Maximum: 10
    // ======================================

    let experienceScore = 0;

    const experienceCount = resume.experience?.length || 0;

    if (experienceCount >= 2) {
      experienceScore = 10;
    } else if (experienceCount === 1) {
      experienceScore = 7;
    }

    // Bonus logic:
    // Check whether job skills appear
    // inside experience descriptions.

    const experienceText = getExperienceText(resume);

    const experienceSkillMatches = matchedSkillsNormalized.filter((skill) => {
      const display = displaySkill(skill).toLowerCase();

      return (
        experienceText.includes(skill.toLowerCase()) ||
        experienceText.includes(display)
      );
    });

    if (experienceCount > 0 && experienceSkillMatches.length > 0) {
      experienceScore = Math.min(10, experienceScore + 2);
    }

    // ======================================
    // PROFILE SCORE
    // Maximum: 5
    // ======================================

    let profileScore = 0;

    if (resume.summary?.trim()) {
      profileScore += 2;
    }

    if (resume.education?.length > 0) {
      profileScore += 2;
    }

    if (
      resume.personalInfo?.linkedIn ||
      resume.personalInfo?.github ||
      resume.personalInfo?.portfolio
    ) {
      profileScore += 1;
    }

    // ======================================
    // FINAL SCORE
    // ======================================

    const matchScore = Math.min(
      100,
      skillScore + projectScore + experienceScore + profileScore,
    );

    // ======================================
    // MATCH LEVEL
    // ======================================

    let matchLevel = "Low Match";

    if (matchScore >= 85) {
      matchLevel = "Excellent Match";
    } else if (matchScore >= 70) {
      matchLevel = "Strong Match";
    } else if (matchScore >= 50) {
      matchLevel = "Moderate Match";
    }

    // ======================================
    // RECOMMENDATIONS
    // ======================================

    const recommendations = [];

    if (missingSkills.length > 0) {
      recommendations.push(
        `Consider learning or demonstrating these required skills: ${missingSkills.join(
          ", ",
        )}.`,
      );
    }

    if (relevantProjects.length === 0) {
      recommendations.push(
        "Add a project that demonstrates technologies required for this role.",
      );
    }

    if (experienceCount === 0) {
      recommendations.push(
        "Add internships, freelance work, volunteering, or relevant technical experience.",
      );
    }

    if (!resume.summary?.trim()) {
      recommendations.push(
        "Add a professional summary tailored to your technical strengths.",
      );
    }

    if (!resume.personalInfo?.linkedIn) {
      recommendations.push(
        "Add your LinkedIn profile to strengthen your professional presence.",
      );
    }

    if (!resume.personalInfo?.github) {
      recommendations.push(
        "Add your GitHub profile so recruiters can review your technical work.",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Your resume aligns strongly with the core requirements of this opportunity.",
      );
    }

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      job: {
        _id: job._id,
        title: job.title,
        company: job.company,
      },

      match: {
        score: matchScore,
        level: matchLevel,

        breakdown: {
          skills: {
            score: skillScore,
            maxScore: 70,
          },

          projects: {
            score: projectScore,
            maxScore: 15,
          },

          experience: {
            score: experienceScore,
            maxScore: 10,
          },

          profile: {
            score: profileScore,
            maxScore: 5,
          },
        },

        matchedSkills,
        missingSkills,
        relevantProjects,
        recommendations,
      },
    });
  } catch (error) {
    console.error("Job Resume Match Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze job compatibility.",
    });
  }
};

module.exports = {
  matchResumeWithJob,
};

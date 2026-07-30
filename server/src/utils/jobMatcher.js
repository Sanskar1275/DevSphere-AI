// ==========================================
// SKILL ALIASES
// ==========================================

const skillAliases = {
  javascript: ["javascript", "js", "ecmascript"],
  typescript: ["typescript", "ts"],

  react: ["react", "reactjs", "react.js"],
  nodejs: ["node", "nodejs", "node.js"],
  expressjs: ["express", "expressjs", "express.js"],

  mongodb: ["mongodb", "mongo", "mongo db"],
  mongoose: ["mongoose", "mongoosejs"],

  mysql: ["mysql", "my sql"],
  postgresql: ["postgresql", "postgres", "psql"],

  html: ["html", "html5"],
  css: ["css", "css3"],

  tailwindcss: ["tailwind", "tailwindcss", "tailwind css"],
  bootstrap: ["bootstrap", "bootstrap5"],

  python: ["python", "python3"],
  java: ["java"],
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

  restapi: ["rest", "rest api", "restapi", "restful api"],
  graphql: ["graphql", "graph ql"],

  redux: ["redux", "redux toolkit", "rtk"],
  vite: ["vite", "vitejs"],

  jwt: ["jwt", "json web token", "json web tokens"],
};

// ==========================================
// DISPLAY NAMES
// ==========================================

const skillDisplayNames = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  nodejs: "Node.js",
  expressjs: "Express.js",
  mongodb: "MongoDB",
  mongoose: "Mongoose",
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
  redux: "Redux",
  vite: "Vite",
  jwt: "JWT",
};

// ==========================================
// HELPERS
// ==========================================

const cleanSkill = (value = "") =>
  value.toString().toLowerCase().trim().replace(/\s+/g, " ");

const normalizeSkill = (value = "") => {
  const cleaned = cleanSkill(value);

  for (const [canonical, aliases] of Object.entries(skillAliases)) {
    if (aliases.some((alias) => cleanSkill(alias) === cleaned)) {
      return canonical;
    }
  }

  return cleaned.replace(/\s+/g, "").replace(/[^\w+#.]/g, "");
};

const displaySkill = (skill) => skillDisplayNames[skill] || skill;

const unique = (values = []) => [...new Set(values)];

// ==========================================
// GET RESUME SKILLS
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
// EXPERIENCE TEXT
// ==========================================

const getExperienceText = (resume) =>
  (resume.experience || [])
    .map((item) =>
      [item.role, item.company, item.description].filter(Boolean).join(" "),
    )
    .join(" ")
    .toLowerCase();

// ==========================================
// CALCULATE JOB MATCH
// ==========================================

const calculateJobMatch = (job, resume) => {
  const resumeSkills = getResumeSkills(resume);

  const jobSkills = unique(
    (job.skills || []).map(normalizeSkill).filter(Boolean),
  );

  const resumeSkillSet = new Set(resumeSkills);

  // ========================================
  // MATCHED / MISSING SKILLS
  // ========================================

  const matchedNormalized = jobSkills.filter((skill) =>
    resumeSkillSet.has(skill),
  );

  const missingNormalized = jobSkills.filter(
    (skill) => !resumeSkillSet.has(skill),
  );

  const matchedSkills = matchedNormalized.map(displaySkill);
  const missingSkills = missingNormalized.map(displaySkill);

  // ========================================
  // SKILLS: 70 POINTS
  // ========================================

  const skillScore =
    jobSkills.length > 0
      ? Math.round((matchedNormalized.length / jobSkills.length) * 70)
      : 70;

  // ========================================
  // PROJECTS: 15 POINTS
  // ========================================

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

  // ========================================
  // EXPERIENCE: 10 POINTS
  // ========================================

  const experienceCount = resume.experience?.length || 0;

  let experienceScore = 0;

  if (experienceCount >= 2) {
    experienceScore = 10;
  } else if (experienceCount === 1) {
    experienceScore = 7;
  }

  const experienceText = getExperienceText(resume);

  const experienceSkillMatches = matchedNormalized.filter((skill) => {
    const readableSkill = displaySkill(skill).toLowerCase();

    return (
      experienceText.includes(skill.toLowerCase()) ||
      experienceText.includes(readableSkill)
    );
  });

  if (experienceCount > 0 && experienceSkillMatches.length > 0) {
    experienceScore = Math.min(10, experienceScore + 2);
  }

  // ========================================
  // PROFILE: 5 POINTS
  // ========================================

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

  // ========================================
  // FINAL SCORE
  // ========================================

  const score = Math.min(
    100,
    skillScore + projectScore + experienceScore + profileScore,
  );

  // ========================================
  // MATCH LEVEL
  // ========================================

  let level = "Low Match";

  if (score >= 85) {
    level = "Excellent Match";
  } else if (score >= 70) {
    level = "Strong Match";
  } else if (score >= 50) {
    level = "Moderate Match";
  }

  // ========================================
  // RECOMMENDATIONS
  // ========================================

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

  // ========================================
  // RESULT
  // ========================================

  return {
    score,
    level,

    matchedSkills,
    missingSkills,

    matchedSkillCount: matchedNormalized.length,
    totalJobSkills: jobSkills.length,

    relevantProjectCount: relevantProjects.length,
    relevantProjects,

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

    recommendations,
  };
};

module.exports = {
  calculateJobMatch,
  normalizeSkill,
  displaySkill,
  getResumeSkills,
};

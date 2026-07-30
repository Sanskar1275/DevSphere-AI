import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Plus,
  Trash2,
  Wrench,
  X,
  FolderGit2,
  BriefcaseBusiness,
  Award,
  Trophy,
  Eye,
  BrainCircuit,
} from "lucide-react";

import { getMyResume, saveMyResume } from "../services/resumeService";

// =====================================================
// DEFAULT DATA
// =====================================================

const initialData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
};

const emptyItems = {
  education: {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    grade: "",
  },

  projects: {
    title: "",
    description: "",
    technologies: [],
    technologyInput: "",
    projectLink: "",
    githubLink: "",
  },

  experience: {
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  },

  certifications: {
    name: "",
    issuer: "",
    date: "",
    credentialLink: "",
  },
};

// =====================================================
// RESUME
// =====================================================

function Resume() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialData);

  const [skillInput, setSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resumeExists, setResumeExists] = useState(false);

  // =====================================================
  // HELPERS
  // =====================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const normalizeResume = (resume) => ({
    personalInfo: {
      ...initialData.personalInfo,
      ...resume.personalInfo,

      fullName: resume.personalInfo?.fullName || resume.user?.fullName || "",

      email: resume.personalInfo?.email || resume.user?.email || "",
    },

    summary: resume.summary || "",

    education: resume.education || [],

    skills: resume.skills || [],

    projects: (resume.projects || []).map((project) => ({
      ...project,
      technologies: project.technologies || [],
      technologyInput: "",
    })),

    experience: resume.experience || [],

    certifications: resume.certifications || [],

    achievements: resume.achievements || [],
  });

  const updateArrayItem = (section, index, field, value) => {
    setFormData((current) => ({
      ...current,

      [section]: current[section].map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));

    clearMessages();
  };

  const addArrayItem = (section) => {
    setFormData((current) => ({
      ...current,

      [section]: [...current[section], { ...emptyItems[section] }],
    }));

    clearMessages();
  };

  const removeArrayItem = (section, index) => {
    setFormData((current) => ({
      ...current,

      [section]: current[section].filter((_, i) => i !== index),
    }));

    clearMessages();
  };

  // =====================================================
  // LOAD RESUME
  // =====================================================

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await getMyResume();

        if (data.exists && data.resume) {
          setFormData(normalizeResume(data.resume));
          setResumeExists(true);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your resume.");
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  // =====================================================
  // PERSONAL INFO
  // =====================================================

  const updatePersonalInfo = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,

      personalInfo: {
        ...current.personalInfo,
        [name]: value,
      },
    }));

    clearMessages();
  };

  // =====================================================
  // TAG HELPER
  // =====================================================

  const addTag = (section, value, clearInput, duplicateMessage) => {
    const tag = value.trim();

    if (!tag) return;

    const exists = formData[section].some(
      (item) => item.toLowerCase() === tag.toLowerCase(),
    );

    if (exists) {
      setSuccess("");
      setError(duplicateMessage);
      return;
    }

    setFormData((current) => ({
      ...current,

      [section]: [...current[section], tag],
    }));

    clearInput("");

    clearMessages();
  };

  const handleTagKey = (event, callback) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();

      callback();
    }
  };

  // =====================================================
  // PROJECT TECHNOLOGIES
  // =====================================================

  const addTechnology = (index) => {
    const project = formData.projects[index];

    const technology = project.technologyInput?.trim();

    if (!technology) return;

    const exists = project.technologies?.some(
      (item) => item.toLowerCase() === technology.toLowerCase(),
    );

    if (exists) {
      setSuccess("");

      setError(`"${technology}" is already added.`);

      return;
    }

    updateArrayItem("projects", index, "technologies", [
      ...(project.technologies || []),
      technology,
    ]);

    updateArrayItem("projects", index, "technologyInput", "");
  };

  const removeTechnology = (projectIndex, techIndex) => {
    const technologies = formData.projects[projectIndex].technologies.filter(
      (_, index) => index !== techIndex,
    );

    updateArrayItem("projects", projectIndex, "technologies", technologies);
  };

  // =====================================================
  // SAVE RESUME
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      clearMessages();

      const cleanedData = {
        ...formData,

        projects: formData.projects.map(
          ({ technologyInput, ...project }) => project,
        ),
      };

      const data = await saveMyResume(cleanedData);

      if (data.resume) {
        setFormData(normalizeResume(data.resume));
      }

      setResumeExists(true);

      setSuccess(data.message || "Resume saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save your resume.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-cyan-400" size={24} />
        Loading Resume...
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col md:flex-row justify-between gap-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FileText className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">Resume Builder</h1>

              <p className="text-slate-400 mt-1">
                Build your professional developer resume.
              </p>
            </div>
          </div>

          <span className="text-sm text-green-400">
            {resumeExists ? "✓ Resume Saved" : "✨ New Resume"}
          </span>
        </div>

        {/* MESSAGES */}

        {success && <Message type="success">{success}</Message>}

        {error && <Message type="error">{error}</Message>}

        {/* FORM */}

        <form onSubmit={handleSave} className="space-y-8 mt-8">
          {/* PERSONAL INFO */}

          <Section title="Personal Information" icon={FileText}>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                ["Full Name", "fullName"],
                ["Email", "email", "email"],
                ["Phone", "phone", "tel"],
                ["Location", "location"],
                ["LinkedIn", "linkedIn", "url"],
                ["GitHub", "github", "url"],
                ["Portfolio", "portfolio", "url"],
              ].map(([label, name, type]) => (
                <Input
                  key={name}
                  label={label}
                  name={name}
                  type={type}
                  value={formData.personalInfo[name]}
                  onChange={updatePersonalInfo}
                />
              ))}
            </div>
          </Section>

          {/* SUMMARY */}

          <Section title="Professional Summary" icon={Sparkles}>
            <Textarea
              value={formData.summary}
              onChange={(event) => {
                setFormData((current) => ({
                  ...current,
                  summary: event.target.value,
                }));

                clearMessages();
              }}
              placeholder="Describe your skills, interests and career goals..."
            />
          </Section>

          {/* EDUCATION */}

          <ArraySection
            title="Education"
            icon={GraduationCap}
            items={formData.education}
            onAdd={() => addArrayItem("education")}
          >
            {formData.education.map((item, index) => (
              <ItemCard
                key={item._id || index}
                title={`Education ${index + 1}`}
                onDelete={() => removeArrayItem("education", index)}
              >
                <FieldGrid
                  fields={[
                    ["Institution", "institution"],
                    ["Degree", "degree"],
                    ["Field of Study", "fieldOfStudy"],
                    ["Grade / CGPA", "grade"],
                    ["Start Year", "startYear"],
                    ["End Year", "endYear"],
                  ]}
                  item={item}
                  onChange={(field, value) =>
                    updateArrayItem("education", index, field, value)
                  }
                />
              </ItemCard>
            ))}
          </ArraySection>

          {/* SKILLS */}

          <Section title="Skills" icon={Wrench}>
            <TagInput
              value={skillInput}
              setValue={setSkillInput}
              placeholder="Example: React.js"
              button="Add Skill"
              onAdd={() =>
                addTag(
                  "skills",
                  skillInput,
                  setSkillInput,
                  `"${skillInput}" is already in your skills.`,
                )
              }
              onKeyDown={(event) =>
                handleTagKey(event, () =>
                  addTag(
                    "skills",
                    skillInput,
                    setSkillInput,
                    `"${skillInput}" is already in your skills.`,
                  ),
                )
              }
            />

            <Tags
              items={formData.skills}
              onRemove={(index) => removeArrayItem("skills", index)}
            />
          </Section>

          {/* PROJECTS */}

          <ArraySection
            title="Projects"
            icon={FolderGit2}
            items={formData.projects}
            onAdd={() => addArrayItem("projects")}
          >
            {formData.projects.map((project, index) => (
              <ItemCard
                key={project._id || index}
                title={`Project ${index + 1}`}
                onDelete={() => removeArrayItem("projects", index)}
              >
                <FieldGrid
                  fields={[
                    ["Project Title", "title"],
                    ["Live Link", "projectLink", "url"],
                    ["GitHub Repository", "githubLink", "url"],
                  ]}
                  item={project}
                  onChange={(field, value) =>
                    updateArrayItem("projects", index, field, value)
                  }
                />

                <Textarea
                  label="Description"
                  value={project.description}
                  onChange={(event) =>
                    updateArrayItem(
                      "projects",
                      index,
                      "description",
                      event.target.value,
                    )
                  }
                />

                <div className="mt-5">
                  <TagInput
                    value={project.technologyInput || ""}
                    setValue={(value) =>
                      updateArrayItem(
                        "projects",
                        index,
                        "technologyInput",
                        value,
                      )
                    }
                    placeholder="Example: MongoDB"
                    button="Add"
                    onAdd={() => addTechnology(index)}
                    onKeyDown={(event) =>
                      handleTagKey(event, () => addTechnology(index))
                    }
                  />
                </div>

                <Tags
                  items={project.technologies || []}
                  onRemove={(techIndex) => removeTechnology(index, techIndex)}
                />
              </ItemCard>
            ))}
          </ArraySection>

          {/* EXPERIENCE */}

          <ArraySection
            title="Experience"
            icon={BriefcaseBusiness}
            items={formData.experience}
            onAdd={() => addArrayItem("experience")}
          >
            {formData.experience.map((item, index) => (
              <ItemCard
                key={item._id || index}
                title={`Experience ${index + 1}`}
                onDelete={() => removeArrayItem("experience", index)}
              >
                <FieldGrid
                  fields={[
                    ["Company / Organization", "company"],
                    ["Role / Position", "role"],
                    ["Start Date", "startDate", "month"],
                    ["End Date", "endDate", "month"],
                  ]}
                  item={item}
                  onChange={(field, value) =>
                    updateArrayItem("experience", index, field, value)
                  }
                />

                <Textarea
                  label="Description"
                  value={item.description}
                  onChange={(event) =>
                    updateArrayItem(
                      "experience",
                      index,
                      "description",
                      event.target.value,
                    )
                  }
                />
              </ItemCard>
            ))}
          </ArraySection>

          {/* CERTIFICATIONS */}

          <ArraySection
            title="Certifications"
            icon={Award}
            items={formData.certifications}
            onAdd={() => addArrayItem("certifications")}
          >
            {formData.certifications.map((item, index) => (
              <ItemCard
                key={item._id || index}
                title={`Certification ${index + 1}`}
                onDelete={() => removeArrayItem("certifications", index)}
              >
                <FieldGrid
                  fields={[
                    ["Certification Name", "name"],
                    ["Issuer", "issuer"],
                    ["Date", "date", "month"],
                    ["Credential Link", "credentialLink", "url"],
                  ]}
                  item={item}
                  onChange={(field, value) =>
                    updateArrayItem("certifications", index, field, value)
                  }
                />
              </ItemCard>
            ))}
          </ArraySection>

          {/* ACHIEVEMENTS */}

          <Section title="Achievements" icon={Trophy}>
            <TagInput
              value={achievementInput}
              setValue={setAchievementInput}
              placeholder="Example: College Hackathon Finalist"
              button="Add Achievement"
              onAdd={() =>
                addTag(
                  "achievements",
                  achievementInput,
                  setAchievementInput,
                  `"${achievementInput}" is already added.`,
                )
              }
              onKeyDown={(event) =>
                handleTagKey(event, () =>
                  addTag(
                    "achievements",
                    achievementInput,
                    setAchievementInput,
                    `"${achievementInput}" is already added.`,
                  ),
                )
              }
            />

            <Tags
              items={formData.achievements}
              onRemove={(index) => removeArrayItem("achievements", index)}
            />
          </Section>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-3">
            {/* PREVIEW */}

            <button
              type="button"
              onClick={() => navigate("/resume/preview")}
              disabled={!resumeExists}
              className="
                px-6
                py-3.5
                rounded-xl
                border
                border-cyan-500/30
                bg-cyan-500/10
                hover:bg-cyan-500/20
                disabled:opacity-40
                disabled:cursor-not-allowed
                text-cyan-400
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >
              <Eye size={19} />
              Preview Resume
            </button>

            {/* AI ANALYSIS */}

            <button
              type="button"
              onClick={() => navigate("/resume/analysis")}
              disabled={!resumeExists}
              className="
                px-6
                py-3.5
                rounded-xl
                border
                border-violet-500/30
                bg-violet-500/10
                hover:bg-violet-500/20
                disabled:opacity-40
                disabled:cursor-not-allowed
                text-violet-400
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >
              <BrainCircuit size={19} />
              Analyze Resume
            </button>

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving}
              className="
                min-w-44
                bg-cyan-500
                hover:bg-cyan-600
                disabled:bg-slate-700
                px-6
                py-3.5
                rounded-xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >
              {saving ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={19} />
                  Save Resume
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =====================================================
// SECTION
// =====================================================

function Section({ title, icon: Icon, children }) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="text-cyan-400" size={22} />

        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {children}
    </section>
  );
}

// =====================================================
// ARRAY SECTION
// =====================================================

function ArraySection({ title, icon: Icon, items, onAdd, children }) {
  return (
    <Section title={title} icon={Icon}>
      <button
        type="button"
        onClick={onAdd}
        className="mb-6 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-cyan-500/20 transition"
      >
        <Plus size={18} />
        Add {title}
      </button>

      {items.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No {title.toLowerCase()} added yet.
        </p>
      ) : (
        <div className="space-y-5">{children}</div>
      )}
    </Section>
  );
}

// =====================================================
// ITEM CARD
// =====================================================

function ItemCard({ title, onDelete, children }) {
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold">{title}</h3>

        <button
          type="button"
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {children}
    </div>
  );
}

// =====================================================
// FIELD GRID
// =====================================================

function FieldGrid({ fields, item, onChange }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {fields.map(([label, name, type]) => (
        <Input
          key={name}
          label={label}
          name={name}
          type={type}
          value={item[name] || ""}
          onChange={(event) => onChange(name, event.target.value)}
        />
      ))}
    </div>
  );
}

// =====================================================
// INPUT
// =====================================================

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>

      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={label}
        className="
          w-full
          bg-slate-950
          border
          border-slate-700
          rounded-xl
          px-4
          py-3
          text-slate-200
          focus:outline-none
          focus:border-cyan-500
          transition
        "
      />
    </div>
  );
}

// =====================================================
// TEXTAREA
// =====================================================

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div className="mt-5">
      {label && (
        <label className="block text-sm text-slate-300 mb-2">{label}</label>
      )}

      <textarea
        value={value || ""}
        onChange={onChange}
        rows={5}
        maxLength={1500}
        placeholder={placeholder}
        className="
          w-full
          bg-slate-950
          border
          border-slate-700
          rounded-xl
          p-4
          text-slate-200
          focus:outline-none
          focus:border-cyan-500
          resize-none
          transition
        "
      />
    </div>
  );
}

// =====================================================
// TAG INPUT
// =====================================================

function TagInput({ value, setValue, placeholder, button, onAdd, onKeyDown }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="
          flex-1
          bg-slate-950
          border
          border-slate-700
          rounded-xl
          px-4
          py-3
          text-slate-200
          focus:outline-none
          focus:border-cyan-500
          transition
        "
      />

      <button
        type="button"
        onClick={onAdd}
        className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl font-semibold transition"
      >
        <Plus size={18} className="inline mr-2" />

        {button}
      </button>
    </div>
  );
}

// =====================================================
// TAGS
// =====================================================

function Tags({ items, onRemove }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-2 rounded-xl text-sm"
        >
          {item}

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="hover:text-white transition"
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
}

// =====================================================
// MESSAGE
// =====================================================

function Message({ type, children }) {
  const isSuccess = type === "success";

  return (
    <div
      className={`mt-6 border rounded-xl p-4 flex items-center gap-3 ${
        isSuccess
          ? "bg-green-500/10 border-green-500/30 text-green-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}

      {children}
    </div>
  );
}

export default Resume;

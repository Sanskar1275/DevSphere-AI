import { useEffect, useState } from "react";

import {
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Link,
  Code2,
  Globe,
  Sparkles,
} from "lucide-react";

import { getMyResume, saveMyResume } from "../services/resumeService";

// ==========================================
// INITIAL FORM DATA
// ==========================================

const initialFormData = {
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

function Resume() {
  // =========================================
  // STATE
  // =========================================

  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [resumeExists, setResumeExists] = useState(false);

  // =========================================
  // LOAD EXISTING RESUME
  // =========================================

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyResume();

        if (data.exists && data.resume) {
          const resume = data.resume;

          setResumeExists(true);

          setFormData({
            personalInfo: {
              fullName:
                resume.personalInfo?.fullName || resume.user?.fullName || "",

              email: resume.personalInfo?.email || resume.user?.email || "",

              phone: resume.personalInfo?.phone || "",

              location: resume.personalInfo?.location || "",

              linkedIn: resume.personalInfo?.linkedIn || "",

              github: resume.personalInfo?.github || "",

              portfolio: resume.personalInfo?.portfolio || "",
            },

            summary: resume.summary || "",

            education: resume.education || [],

            skills: resume.skills || [],

            projects: resume.projects || [],

            experience: resume.experience || [],

            certifications: resume.certifications || [],

            achievements: resume.achievements || [],
          });
        }
      } catch (error) {
        console.error("Failed to load resume:", error);

        setError(
          error.response?.data?.message || "Failed to load your resume.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  // =========================================
  // PERSONAL INFO CHANGE
  // =========================================

  const handlePersonalInfoChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,

      personalInfo: {
        ...current.personalInfo,
        [name]: value,
      },
    }));

    setSuccess("");
  };

  // =========================================
  // SUMMARY CHANGE
  // =========================================

  const handleSummaryChange = (event) => {
    setFormData((current) => ({
      ...current,
      summary: event.target.value,
    }));

    setSuccess("");
  };

  // =========================================
  // SAVE RESUME
  // =========================================

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      setError("");
      setSuccess("");

      const data = await saveMyResume(formData);

      setResumeExists(true);

      if (data.resume) {
        setFormData((current) => ({
          ...current,

          personalInfo: {
            ...current.personalInfo,
            ...(data.resume.personalInfo || {}),
          },

          summary: data.resume.summary ?? current.summary,
        }));
      }

      setSuccess(data.message || "Resume saved successfully.");
    } catch (error) {
      console.error("Failed to save resume:", error);

      setError(error.response?.data?.message || "Failed to save your resume.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
          Loading Resume...
        </div>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FileText size={25} className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Resume Builder</h1>

              <p className="text-slate-400 mt-1">
                Build and manage your professional developer resume.
              </p>
            </div>
          </div>

          <div>
            {resumeExists ? (
              <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm">
                <CheckCircle2 size={16} />
                Resume Saved
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm">
                <Sparkles size={16} />
                New Resume
              </span>
            )}
          </div>
        </div>

        {/* =====================================
            MESSAGE AREA
        ===================================== */}

        {success && (
          <div className="mt-8 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />

            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />

            <p>{error}</p>
          </div>
        )}

        {/* =====================================
            FORM
        ===================================== */}

        <form onSubmit={handleSave} className="mt-8 space-y-8">
          {/* ===================================
              PERSONAL INFORMATION
          =================================== */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div>
              <h2 className="text-2xl font-bold">Personal Information</h2>

              <p className="text-slate-400 mt-2">
                Add the contact information recruiters should see on your
                resume.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-7">
              {/* FULL NAME */}

              <InputField
                label="Full Name"
                name="fullName"
                value={formData.personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                placeholder="Your full name"
                icon={User}
              />

              {/* EMAIL */}

              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.personalInfo.email}
                onChange={handlePersonalInfoChange}
                placeholder="you@example.com"
                icon={Mail}
              />

              {/* PHONE */}

              <InputField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.personalInfo.phone}
                onChange={handlePersonalInfoChange}
                placeholder="+91 98765 43210"
                icon={Phone}
              />

              {/* LOCATION */}

              <InputField
                label="Location"
                name="location"
                value={formData.personalInfo.location}
                onChange={handlePersonalInfoChange}
                placeholder="Pune, Maharashtra"
                icon={MapPin}
              />

              {/* LINKEDIN */}

              <InputField
                label="LinkedIn"
                name="linkedIn"
                type="url"
                value={formData.personalInfo.linkedIn}
                onChange={handlePersonalInfoChange}
                placeholder="https://linkedin.com/in/username"
                icon={Link}
              />

              {/* GITHUB */}

              <InputField
                label="GitHub"
                name="github"
                type="url"
                value={formData.personalInfo.github}
                onChange={handlePersonalInfoChange}
                placeholder="https://github.com/username"
                icon={Code2}
              />

              {/* PORTFOLIO */}

              <div className="md:col-span-2">
                <InputField
                  label="Portfolio"
                  name="portfolio"
                  type="url"
                  value={formData.personalInfo.portfolio}
                  onChange={handlePersonalInfoChange}
                  placeholder="https://yourportfolio.com"
                  icon={Globe}
                />
              </div>
            </div>
          </section>

          {/* ===================================
              PROFESSIONAL SUMMARY
          =================================== */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Sparkles size={19} className="text-cyan-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Professional Summary</h2>

                <p className="text-slate-400 mt-2">
                  Write a short introduction describing your skills, interests
                  and career goals.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <textarea
                value={formData.summary}
                onChange={handleSummaryChange}
                rows={7}
                maxLength={1200}
                placeholder="Example: Information Technology student and full-stack developer with experience building MERN applications..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none transition"
              />

              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Keep it concise and recruiter-friendly.</span>

                <span>
                  {formData.summary.length}
                  /1200
                </span>
              </div>
            </div>
          </section>

          {/* ===================================
              FUTURE SECTIONS
          =================================== */}

          <section className="bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Coming Next
            </p>

            <h2 className="text-xl font-bold mt-2">More Resume Sections</h2>

            <p className="text-slate-400 mt-2">
              Education, skills, projects, experience, certifications and
              achievements will be added next.
            </p>
          </section>

          {/* ===================================
              SAVE
          =================================== */}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="min-w-44 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
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

// ==========================================
// REUSABLE INPUT COMPONENT
// ==========================================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-300 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-950 border border-slate-700 rounded-xl py-3.5 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition ${
            Icon ? "pl-11" : "pl-4"
          }`}
        />
      </div>
    </div>
  );
}

export default Resume;

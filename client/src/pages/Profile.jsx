import { useEffect, useMemo, useState } from "react";

import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Globe,
  Briefcase,
  Save,
  Loader2,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ExternalLink,
  Code2,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import API from "../services/axios";

// ======================================================
// DEFAULT PROFILE
// ======================================================

const DEFAULT_PROFILE = {
  bio: "",
  phone: "",
  location: "",

  education: {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    graduationYear: "",
  },

  skills: [],

  github: "",
  linkedin: "",
  portfolio: "",

  avatar: "",
};

// ======================================================
// NORMALIZE PROFILE
// ======================================================

const normalizeProfile = (profile = {}) => ({
  bio: profile?.bio || "",
  phone: profile?.phone || "",
  location: profile?.location || "",

  education: {
    institution: profile?.education?.institution || "",
    degree: profile?.education?.degree || "",
    fieldOfStudy: profile?.education?.fieldOfStudy || "",
    graduationYear: profile?.education?.graduationYear || "",
  },

  skills: Array.isArray(profile?.skills) ? profile.skills : [],

  github: profile?.github || "",
  linkedin: profile?.linkedin || "",
  portfolio: profile?.portfolio || "",

  avatar: profile?.avatar || "",
});

// ======================================================
// INPUT FIELD
// ======================================================

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border py-3.5 text-white outline-none transition ${
            Icon ? "pl-11" : "px-4"
          } pr-4 ${
            disabled
              ? "bg-slate-950/50 border-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-slate-950 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
          }`}
        />
      </div>
    </div>
  );
}

// ======================================================
// PROFILE SECTION
// ======================================================

function ProfileSection({ icon: Icon, title, description, children }) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <Icon size={21} className="text-cyan-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>

          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

// ======================================================
// PROFILE PAGE
// ======================================================

function Profile() {
  const { user, updateUser } = useAuth();

  // ====================================================
  // STATE
  // ====================================================

  const [fullName, setFullName] = useState(user?.fullName || "");

  const [email, setEmail] = useState(user?.email || "");

  const [role, setRole] = useState(user?.role || "student");

  const [profile, setProfile] = useState(
    normalizeProfile(user?.profile || DEFAULT_PROFILE),
  );

  const [newSkill, setNewSkill] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ====================================================
  // LOAD PROFILE
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/auth/profile");

        if (!mounted) return;

        const currentUser = response?.data?.user;

        if (!currentUser) {
          throw new Error("User profile not found.");
        }

        setFullName(currentUser.fullName || "");
        setEmail(currentUser.email || "");
        setRole(currentUser.role || "student");

        setProfile(normalizeProfile(currentUser.profile || DEFAULT_PROFILE));

        updateUser(currentUser);
      } catch (err) {
        console.error("Profile loading error:", err);

        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load profile.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // PROFILE COMPLETION
  // ====================================================

  const completion = useMemo(() => {
    const fields = [
      fullName,
      profile.bio,
      profile.phone,
      profile.location,
      profile.education.institution,
      profile.education.degree,
      profile.education.fieldOfStudy,
      profile.education.graduationYear,
      profile.skills.length > 0,
      profile.github,
      profile.linkedin,
      profile.portfolio,
    ];

    const completed = fields.filter(
      (field) =>
        field === true ||
        (typeof field === "string" && field.trim().length > 0),
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [fullName, profile]);

  // ====================================================
  // INITIALS
  // ====================================================

  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("") || "U";

  // ====================================================
  // PROFILE CHANGE
  // ====================================================

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ====================================================
  // EDUCATION CHANGE
  // ====================================================

  const handleEducationChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,

      education: {
        ...prev.education,
        [name]: value,
      },
    }));

    setMessage("");
    setError("");
  };

  // ====================================================
  // ADD SKILL
  // ====================================================

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const exists = profile.skills.some(
      (existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase(),
    );

    if (exists) {
      setError("This skill is already added.");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setNewSkill("");
    setError("");
    setMessage("");
  };

  // ====================================================
  // SKILL ENTER
  // ====================================================

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  // ====================================================
  // REMOVE SKILL
  // ====================================================

  const removeSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,

      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));

    setMessage("");
    setError("");
  };

  // ====================================================
  // SAVE PROFILE
  // ====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!fullName.trim()) {
        throw new Error("Full name is required.");
      }

      const payload = {
        fullName: fullName.trim(),

        bio: profile.bio.trim(),

        phone: profile.phone.trim(),

        location: profile.location.trim(),

        education: {
          institution: profile.education.institution.trim(),

          degree: profile.education.degree.trim(),

          fieldOfStudy: profile.education.fieldOfStudy.trim(),

          graduationYear: profile.education.graduationYear
            ? Number(profile.education.graduationYear)
            : null,
        },

        skills: profile.skills,

        github: profile.github.trim(),

        linkedin: profile.linkedin.trim(),

        portfolio: profile.portfolio.trim(),

        avatar: profile.avatar.trim(),
      };

      // Send complete profile directly to backend
      const response = await API.put("/auth/profile", payload);

      const updatedUser = response?.data?.user;

      if (updatedUser) {
        setFullName(updatedUser.fullName || "");
        setEmail(updatedUser.email || "");
        setRole(updatedUser.role || "student");

        setProfile(normalizeProfile(updatedUser.profile || DEFAULT_PROFILE));

        updateUser(updatedUser);
      }

      setMessage(response?.data?.message || "Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={42} className="text-cyan-400 animate-spin" />

          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* BACKGROUND */}

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black">My Profile</h1>

          <p className="text-slate-400 mt-2">
            Build your professional DevSphere AI profile.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl px-5 py-4">
            <CheckCircle2 size={20} />
            <span>{message}</span>
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-5 py-4">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* PROFILE HEADER */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* AVATAR */}

            <div className="relative shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={fullName || "User"}
                  className="w-28 h-28 rounded-3xl object-cover border border-slate-700"
                />
              ) : (
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-black shadow-lg shadow-cyan-500/10">
                  {initials}
                </div>
              )}

              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
                <Camera size={16} className="text-cyan-400" />
              </div>
            </div>

            {/* USER INFORMATION */}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {fullName || "Your Name"}
                </h2>

                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold capitalize">
                  {role}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3 text-slate-400">
                <Mail size={16} />
                <span>{email}</span>
              </div>

              {profile.location && (
                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                  <MapPin size={15} />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* COMPLETION */}

            <div className="sm:w-48">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">
                  Profile completion
                </span>

                <span className="text-sm font-bold text-cyan-400">
                  {completion}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-600 mt-2">
                Complete your profile to stand out.
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE FORM */}

        <form onSubmit={handleSave} className="space-y-8">
          {/* BASIC INFORMATION */}

          <ProfileSection
            icon={User}
            title="Basic Information"
            description="Tell recruiters and other users about yourself."
          >
            <div className="grid md:grid-cols-2 gap-5">
              <InputField
                label="Full Name"
                name="fullName"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setMessage("");
                  setError("");
                }}
                placeholder="Your full name"
                icon={User}
              />

              <InputField
                label="Email Address"
                name="email"
                value={email}
                disabled
                icon={Mail}
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="+91 XXXXX XXXXX"
                icon={Phone}
                type="tel"
              />

              <InputField
                label="Location"
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                placeholder="Pune, Maharashtra"
                icon={MapPin}
              />
            </div>

            {/* BIO */}

            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Professional Bio
              </label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                maxLength={500}
                rows={5}
                placeholder="Tell recruiters about your background, interests and career goals..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
              />

              <div className="text-right text-xs text-slate-600 mt-2">
                {profile.bio.length}/500
              </div>
            </div>
          </ProfileSection>

          {/* EDUCATION */}

          <ProfileSection
            icon={GraduationCap}
            title="Education"
            description="Add your academic background."
          >
            <div className="grid md:grid-cols-2 gap-5">
              <InputField
                label="Institution"
                name="institution"
                value={profile.education.institution}
                onChange={handleEducationChange}
                placeholder="University / College"
                icon={GraduationCap}
              />

              <InputField
                label="Degree"
                name="degree"
                value={profile.education.degree}
                onChange={handleEducationChange}
                placeholder="B.Tech"
                icon={GraduationCap}
              />

              <InputField
                label="Field of Study"
                name="fieldOfStudy"
                value={profile.education.fieldOfStudy}
                onChange={handleEducationChange}
                placeholder="Information Technology"
                icon={GraduationCap}
              />

              <InputField
                label="Graduation Year"
                name="graduationYear"
                value={profile.education.graduationYear}
                onChange={handleEducationChange}
                placeholder="2027"
                type="number"
                icon={GraduationCap}
              />
            </div>
          </ProfileSection>

          {/* SKILLS */}

          <ProfileSection
            icon={Briefcase}
            title="Skills"
            description="Add technologies and skills you know."
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newSkill}
                onChange={(event) => setNewSkill(event.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React.js"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
              />

              <button
                type="button"
                onClick={addSkill}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
              >
                <Plus size={18} />
                Add Skill
              </button>
            </div>

            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-5">
                {profile.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-xl px-3.5 py-2"
                  >
                    <span className="text-sm font-medium">{skill}</span>

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-cyan-500 hover:text-red-400 transition"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 mt-5">
                No skills added yet.
              </p>
            )}
          </ProfileSection>

          {/* PROFESSIONAL LINKS */}

          <ProfileSection
            icon={Globe}
            title="Professional Links"
            description="Connect your professional presence."
          >
            <div className="grid md:grid-cols-2 gap-5">
              <InputField
                label="GitHub"
                name="github"
                value={profile.github}
                onChange={handleProfileChange}
                placeholder="https://github.com/username"
                icon={Code2}
              />

              <InputField
                label="LinkedIn"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleProfileChange}
                placeholder="https://linkedin.com/in/username"
                icon={Briefcase}
              />

              <InputField
                label="Portfolio"
                name="portfolio"
                value={profile.portfolio}
                onChange={handleProfileChange}
                placeholder="https://yourportfolio.com"
                icon={Globe}
              />

              <InputField
                label="Avatar URL"
                name="avatar"
                value={profile.avatar}
                onChange={handleProfileChange}
                placeholder="https://example.com/avatar.jpg"
                icon={Camera}
              />
            </div>

            {/* LINK PREVIEW */}

            <div className="mt-6 flex flex-wrap gap-3">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition"
                >
                  <Code2 size={16} />
                  GitHub
                  <ExternalLink size={13} />
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition"
                >
                  <Briefcase size={16} />
                  LinkedIn
                  <ExternalLink size={13} />
                </a>
              )}

              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition"
                >
                  <Globe size={16} />
                  Portfolio
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </ProfileSection>

          {/* SAVE */}

          <div className="flex justify-end pb-8">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10"
            >
              {saving ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save size={19} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;

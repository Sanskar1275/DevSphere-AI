import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, BriefcaseBusiness, Loader2, Save } from "lucide-react";

import { getJobById, updateJob } from "../services/jobService";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    jobType: "Internship",
    location: "",
    workMode: "On-site",
    experience: "",
    salary: "",
    skills: "",
    requirements: "",
    responsibilities: "",
    applyLink: "",
    companyLogo: "",
    applicationDeadline: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD EXISTING JOB
  // =========================================

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const job = await getJobById(id);

        setFormData({
          title: job.title || "",
          company: job.company || "",
          description: job.description || "",
          jobType: job.jobType || "Internship",
          location: job.location || "",
          workMode: job.workMode || "On-site",
          experience: job.experience || "",
          salary: job.salary || "",

          skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",

          requirements: Array.isArray(job.requirements)
            ? job.requirements.join(", ")
            : "",

          responsibilities: Array.isArray(job.responsibilities)
            ? job.responsibilities.join(", ")
            : "",

          applyLink: job.applyLink || "",
          companyLogo: job.companyLogo || "",

          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Failed to load job:", error);

        setError(error.response?.data?.message || "Failed to load job.");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================
  // STRING TO ARRAY
  // =========================================

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // =========================================
  // UPDATE JOB
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updating) return;

    try {
      setUpdating(true);
      setError("");

      const updatedJob = {
        title: formData.title.trim(),

        company: formData.company.trim(),

        description: formData.description.trim(),

        jobType: formData.jobType,

        location: formData.location.trim(),

        workMode: formData.workMode,

        experience: formData.experience.trim() || "Fresher",

        salary: formData.salary.trim() || "Not Disclosed",

        skills: convertToArray(formData.skills),

        requirements: convertToArray(formData.requirements),

        responsibilities: convertToArray(formData.responsibilities),

        applyLink: formData.applyLink.trim(),

        companyLogo: formData.companyLogo.trim(),

        applicationDeadline: formData.applicationDeadline || null,
      };

      await updateJob(id, updatedJob);

      alert("✅ Job Updated Successfully!");

      navigate("/admin/jobs");
    } catch (error) {
      console.error("Update Job Error:", error);

      setError(error.response?.data?.message || "Failed to update job.");
    } finally {
      setUpdating(false);
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
          Loading Job...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate("/admin/jobs")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={19} />
          Back to Manage Jobs
        </button>

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
            <BriefcaseBusiness size={24} className="text-cyan-400" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Edit Job</h1>

            <p className="text-slate-400 mt-1">
              Update this job or internship opportunity.
            </p>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8"
        >
          <div className="grid md:grid-cols-2 gap-5">
            {/* TITLE */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            {/* COMPANY */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Company
              </label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            {/* JOB TYPE */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Job Type
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              >
                <option value="Internship">Internship</option>

                <option value="Full-time">Full-time</option>

                <option value="Part-time">Part-time</option>

                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* WORK MODE */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Work Mode
              </label>

              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              >
                <option value="On-site">On-site</option>

                <option value="Remote">Remote</option>

                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* LOCATION */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            {/* EXPERIENCE */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Experience
              </label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Fresher"
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            {/* SALARY */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Salary / Stipend
              </label>

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="₹15,000/month"
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            {/* DEADLINE */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Application Deadline
              </label>

              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="mt-5">
            <label className="block text-sm text-slate-400 mb-2">
              Job Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />
          </div>

          {/* SKILLS */}

          <div className="mt-5">
            <label className="block text-sm text-slate-400 mb-2">Skills</label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, JavaScript, HTML, CSS"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />

            <p className="text-xs text-slate-500 mt-2">
              Separate skills using commas.
            </p>
          </div>

          {/* REQUIREMENTS */}

          <div className="mt-5">
            <label className="block text-sm text-slate-400 mb-2">
              Requirements
            </label>

            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="3"
              placeholder="React knowledge, Git knowledge, Communication skills"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />

            <p className="text-xs text-slate-500 mt-2">
              Separate requirements using commas.
            </p>
          </div>

          {/* RESPONSIBILITIES */}

          <div className="mt-5">
            <label className="block text-sm text-slate-400 mb-2">
              Responsibilities
            </label>

            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows="3"
              placeholder="Build UI components, Work with APIs, Fix bugs"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />

            <p className="text-xs text-slate-500 mt-2">
              Separate responsibilities using commas.
            </p>
          </div>

          {/* APPLICATION LINK */}

          <div className="mt-5">
            <label className="block text-sm text-slate-400 mb-2">
              Application Link
            </label>

            <input
              type="url"
              name="applyLink"
              value={formData.applyLink}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />
          </div>

          {/* COMPANY LOGO */}

          <div className="mt-5">
            <label className="block text-sm text-slate-400 mb-2">
              Company Logo URL
            </label>

            <input
              type="url"
              name="companyLogo"
              value={formData.companyLogo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />
          </div>

          {/* UPDATE BUTTON */}

          <button
            type="submit"
            disabled={updating}
            className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition"
          >
            {updating ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Updating Job...
              </>
            ) : (
              <>
                <Save size={19} />
                Update Job
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJob;

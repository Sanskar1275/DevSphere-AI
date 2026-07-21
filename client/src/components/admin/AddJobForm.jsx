import { useState } from "react";

import { createJob } from "../../services/jobService";

function AddJobForm() {
  const [formData, setFormData] =
    useState({
      title: "",
      company: "",
      description: "",
      jobType: "Internship",
      location: "",
      workMode: "On-site",
      experience: "Fresher",
      salary: "",
      skills: "",
      requirements: "",
      responsibilities: "",
      applyLink: "",
      companyLogo: "",
      applicationDeadline: "",
    });

  const [submitting, setSubmitting] =
    useState(false);

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // CONVERT COMMA-SEPARATED TEXT TO ARRAY
  // =========================================

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // =========================================
  // SUBMIT JOB
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);

      const jobData = {
        title: formData.title,
        company: formData.company,
        description:
          formData.description,

        jobType: formData.jobType,

        location: formData.location,

        workMode: formData.workMode,

        experience:
          formData.experience ||
          "Fresher",

        salary:
          formData.salary ||
          "Not Disclosed",

        skills: convertToArray(
          formData.skills
        ),

        requirements: convertToArray(
          formData.requirements
        ),

        responsibilities:
          convertToArray(
            formData.responsibilities
          ),

        applyLink: formData.applyLink,

        companyLogo:
          formData.companyLogo,

        applicationDeadline:
          formData.applicationDeadline ||
          null,
      };

      await createJob(jobData);

      alert(
        "✅ Job Created Successfully!"
      );

      // RESET FORM

      setFormData({
        title: "",
        company: "",
        description: "",
        jobType: "Internship",
        location: "",
        workMode: "On-site",
        experience: "Fresher",
        salary: "",
        skills: "",
        requirements: "",
        responsibilities: "",
        applyLink: "",
        companyLogo: "",
        applicationDeadline: "",
      });
    } catch (error) {
      console.error(
        "Create Job Error:",
        error
      );

      console.error(
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "❌ Failed to Create Job"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8"
    >

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-cyan-400">
          Add New Job
        </h2>

        <p className="text-slate-400 mt-2">
          Create a new job or internship
          opportunity.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {/* JOB TITLE */}

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Job Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Frontend Developer Intern"
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
            placeholder="Company Name"
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
            <option value="Internship">
              Internship
            </option>

            <option value="Full-time">
              Full-time
            </option>

            <option value="Part-time">
              Part-time
            </option>

            <option value="Contract">
              Contract
            </option>
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
            <option value="On-site">
              On-site
            </option>

            <option value="Remote">
              Remote
            </option>

            <option value="Hybrid">
              Hybrid
            </option>
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
            placeholder="Pune, Maharashtra"
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
            value={
              formData.applicationDeadline
            }
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
          placeholder="Describe the role and opportunity..."
          required
          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
        />
      </div>

      {/* SKILLS */}

      <div className="mt-5">
        <label className="block text-sm text-slate-400 mb-2">
          Skills
        </label>

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
          placeholder="Basic React knowledge, Good communication, Git knowledge"
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
          value={
            formData.responsibilities
          }
          onChange={handleChange}
          rows="3"
          placeholder="Build UI components, Fix bugs, Work with APIs"
          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
        />

        <p className="text-xs text-slate-500 mt-2">
          Separate responsibilities using
          commas.
        </p>
      </div>

      {/* APPLY LINK */}

      <div className="mt-5">
        <label className="block text-sm text-slate-400 mb-2">
          Application Link
        </label>

        <input
          type="url"
          name="applyLink"
          value={formData.applyLink}
          onChange={handleChange}
          placeholder="https://company.com/apply"
          required
          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
        />
      </div>

      {/* LOGO */}

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

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold transition"
      >
        {submitting
          ? "Creating Job..."
          : "Create Job"}
      </button>

    </form>
  );
}

export default AddJobForm;
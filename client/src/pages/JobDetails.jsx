import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  IndianRupee,
  Loader2,
  MapPin,
  CheckCircle2,
  Send,
  X,
  ExternalLink,
} from "lucide-react";

import { getJobById } from "../services/jobService";

import { applyForJob, getMyApplications } from "../services/applicationService";

function JobDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showApplyModal, setShowApplyModal] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");

  const [applying, setApplying] = useState(false);

  const [applicationError, setApplicationError] = useState("");

  const [applicationSuccess, setApplicationSuccess] = useState("");

  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [checkingApplication, setCheckingApplication] = useState(true);

  // =========================================
  // LOAD JOB DETAILS
  // =========================================

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobById(id);

        setJob(data);
      } catch (error) {
        console.error("Failed to load job:", error);

        setError(
          error.response?.data?.message || "Failed to load job details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  // =========================================
  // CHECK WHETHER USER ALREADY APPLIED
  // =========================================

  useEffect(() => {
    const checkApplication = async () => {
      try {
        setCheckingApplication(true);

        const data = await getMyApplications();

        const applications = data.applications || [];

        const found = applications.some(
          (application) =>
            application.job?._id === id && application.status !== "Withdrawn",
        );

        setAlreadyApplied(found);
      } catch (error) {
        console.error("Failed to check application:", error);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [id]);

  // =========================================
  // OPEN APPLY MODAL
  // =========================================

  const openApplyModal = () => {
    setApplicationError("");
    setApplicationSuccess("");
    setShowApplyModal(true);
  };

  // =========================================
  // CLOSE APPLY MODAL
  // =========================================

  const closeApplyModal = () => {
    if (applying) {
      return;
    }

    setShowApplyModal(false);
    setApplicationError("");
  };

  // =========================================
  // SUBMIT APPLICATION
  // =========================================

  const handleApply = async () => {
    try {
      setApplying(true);

      setApplicationError("");
      setApplicationSuccess("");

      const data = await applyForJob(id, coverLetter);

      setApplicationSuccess(
        data.message || "Application submitted successfully",
      );

      setAlreadyApplied(true);

      setCoverLetter("");

      setTimeout(() => {
        setShowApplyModal(false);
        setApplicationSuccess("");
      }, 1800);
    } catch (error) {
      console.error("Application failed:", error);

      const message =
        error.response?.data?.message || "Failed to submit application.";

      setApplicationError(message);

      if (message.toLowerCase().includes("already applied")) {
        setAlreadyApplied(true);
      }
    } finally {
      setApplying(false);
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

  // =========================================
  // ERROR / JOB NOT FOUND
  // =========================================

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <Briefcase size={48} className="text-slate-600 mb-4" />

        <h2 className="text-2xl font-bold">Job Not Found</h2>

        <p className="text-slate-400 mt-2 text-center">
          {error || "This opportunity is no longer available."}
        </p>

        <button
          onClick={() => navigate("/jobs")}
          className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  // =========================================
  // DEADLINE CHECK
  // =========================================

  const deadlinePassed =
    job.applicationDeadline && new Date(job.applicationDeadline) < new Date();

  const canApply = job.isActive !== false && !deadlinePassed && !alreadyApplied;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* BACK BUTTON */}

        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={19} />
          Back to Jobs
        </button>

        {/* =====================================
            JOB HEADER
        ===================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* COMPANY LOGO */}

              <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 size={30} className="text-cyan-400" />
                )}
              </div>

              {/* TITLE */}

              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>

                <div className="flex items-center gap-2 text-slate-400 mt-2">
                  <Building2 size={18} />

                  <span>{job.company}</span>
                </div>
              </div>
            </div>

            <span className="self-start bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium">
              {job.jobType}
            </span>
          </div>

          {/* META INFORMATION */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <MapPin size={20} className="text-cyan-400 mb-3" />

              <p className="text-xs text-slate-500">Location</p>

              <p className="text-sm font-medium mt-1">{job.location}</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <Briefcase size={20} className="text-cyan-400 mb-3" />

              <p className="text-xs text-slate-500">Work Mode</p>

              <p className="text-sm font-medium mt-1">
                {job.workMode || "Not specified"}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <Clock3 size={20} className="text-cyan-400 mb-3" />

              <p className="text-xs text-slate-500">Experience</p>

              <p className="text-sm font-medium mt-1">
                {job.experience || "Not specified"}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <IndianRupee size={20} className="text-cyan-400 mb-3" />

              <p className="text-xs text-slate-500">Salary / Stipend</p>

              <p className="text-sm font-medium mt-1">
                {job.salary || "Not Disclosed"}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-8">
          {/* LEFT */}

          <div className="space-y-8">
            {/* DESCRIPTION */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold">About the Opportunity</h2>

              <p className="text-slate-300 leading-7 mt-5 whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {/* SKILLS */}

            {job.skills?.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold">Skills Required</h2>

                <div className="flex flex-wrap gap-3 mt-5">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* REQUIREMENTS */}

            {job.requirements?.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold">Requirements</h2>

                <div className="space-y-4 mt-5">
                  {job.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2
                        size={19}
                        className="text-cyan-400 shrink-0 mt-1"
                      />

                      <p className="text-slate-300 leading-6">{requirement}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* RESPONSIBILITIES */}

            {job.responsibilities?.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold">Responsibilities</h2>

                <div className="space-y-4 mt-5">
                  {job.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2
                        size={19}
                        className="text-cyan-400 shrink-0 mt-1"
                      />

                      <p className="text-slate-300 leading-6">
                        {responsibility}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* =====================================
              RIGHT SIDEBAR
          ===================================== */}

          <aside>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold">Interested in this role?</h2>

              <p className="text-slate-400 text-sm leading-6 mt-3">
                Apply directly through DevSphere and track your application
                status.
              </p>

              {/* APPLY BUTTON */}

              <button
                type="button"
                onClick={openApplyModal}
                disabled={checkingApplication || !canApply}
                className={`w-full mt-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                  alreadyApplied
                    ? "bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed"
                    : canApply
                      ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {checkingApplication ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Checking...
                  </>
                ) : alreadyApplied ? (
                  <>
                    <CheckCircle2 size={18} />
                    Applied
                  </>
                ) : deadlinePassed ? (
                  "Applications Closed"
                ) : job.isActive === false ? (
                  "Job Closed"
                ) : (
                  <>
                    <Send size={18} />
                    Apply Now
                  </>
                )}
              </button>

              {/* OPTIONAL EXTERNAL LINK */}

              {job.applyLink && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(job.applyLink, "_blank", "noopener,noreferrer")
                  }
                  className="w-full mt-3 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 py-3 rounded-xl text-sm text-slate-300 flex items-center justify-center gap-2 transition"
                >
                  Company Application Page
                  <ExternalLink size={16} />
                </button>
              )}

              {/* DEADLINE */}

              <div className="border-t border-slate-800 mt-6 pt-6">
                <div className="flex items-start gap-3">
                  <CalendarDays size={19} className="text-cyan-400 shrink-0" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Application Deadline
                    </p>

                    <p className="text-sm mt-1">
                      {job.applicationDeadline
                        ? new Date(job.applicationDeadline).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* POSTED */}

              <div className="border-t border-slate-800 mt-5 pt-5">
                <p className="text-xs text-slate-500">Posted On</p>

                <p className="text-sm mt-1">
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Recently"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =====================================
          APPLY MODAL
      ===================================== */}

      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold">Apply for {job.title}</h2>

                <p className="text-slate-400 mt-1">{job.company}</p>
              </div>

              <button
                type="button"
                onClick={closeApplyModal}
                disabled={applying}
                className="text-slate-400 hover:text-white transition disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cover Letter
                <span className="text-slate-500 font-normal"> (Optional)</span>
              </label>

              <textarea
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                disabled={applying}
                rows={8}
                maxLength={3000}
                placeholder="Tell the company why you're interested in this opportunity..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none disabled:opacity-60"
              />

              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Optional</span>

                <span>
                  {coverLetter.length}
                  /3000
                </span>
              </div>

              {/* ERROR */}

              {applicationError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
                  {applicationError}
                </div>
              )}

              {/* SUCCESS */}

              {applicationSuccess && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-3 text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} />

                  {applicationSuccess}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
              <button
                type="button"
                onClick={closeApplyModal}
                disabled={applying}
                className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={applying || Boolean(applicationSuccess)}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl font-semibold flex items-center gap-2 transition"
              >
                {applying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;

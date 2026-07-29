import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  User,
  XCircle,
} from "lucide-react";

import {
  getAdminApplicationById,
  updateApplicationStatus,
} from "../services/adminApplicationService";

const editableStatuses = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

function AdminApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updating, setUpdating] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  // =========================================
  // LOAD APPLICATION
  // =========================================

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminApplicationById(id);

        setApplication(data.application);
      } catch (error) {
        console.error("Failed to load application:", error);

        setError(
          error.response?.data?.message || "Failed to load application.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id]);

  // =========================================
  // UPDATE STATUS
  // =========================================

  const handleStatusChange = async (newStatus) => {
    if (!application) {
      return;
    }

    if (newStatus === application.status) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccessMessage("");

      const data = await updateApplicationStatus(application._id, newStatus);

      setApplication((current) => ({
        ...current,
        ...data.application,

        // Preserve fully populated details if
        // the update endpoint returns fewer fields.
        user: data.application?.user || current.user,

        job: {
          ...current.job,
          ...(data.application?.job || {}),
        },
      }));

      setSuccessMessage(`Application status updated to "${newStatus}".`);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Failed to update application status:", error);

      setError(
        error.response?.data?.message || "Failed to update application status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";

      case "Under Review":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";

      case "Shortlisted":
        return "bg-purple-500/10 border-purple-500/30 text-purple-400";

      case "Interview":
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";

      case "Selected":
        return "bg-green-500/10 border-green-500/30 text-green-400";

      case "Rejected":
        return "bg-red-500/10 border-red-500/30 text-red-400";

      case "Withdrawn":
        return "bg-slate-500/10 border-slate-500/30 text-slate-400";

      default:
        return "bg-slate-500/10 border-slate-500/30 text-slate-400";
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
          Loading Application...
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR / NOT FOUND
  // =========================================

  if (error && !application) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <FileText size={48} className="text-slate-600 mb-4" />

        <h2 className="text-2xl font-bold">Application Not Found</h2>

        <p className="text-slate-400 mt-2 text-center">{error}</p>

        <button
          type="button"
          onClick={() => navigate("/admin/applications")}
          className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const user = application.user || {};
  const job = application.job || {};

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* =====================================
            BACK
        ===================================== */}

        <button
          type="button"
          onClick={() => navigate("/admin/applications")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={19} />
          Back to Applications
        </button>

        {/* =====================================
            APPLICATION HEADER
        ===================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="text-cyan-400 font-semibold text-sm">
                Candidate Application
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                {user.fullName || "Unknown Candidate"}
              </h1>

              <div className="flex items-center gap-2 text-slate-400 mt-3">
                <Mail size={17} />

                <span>{user.email || "Email unavailable"}</span>
              </div>
            </div>

            <span
              className={`self-start border rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
                application.status,
              )}`}
            >
              {application.status}
            </span>
          </div>

          {/* META */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <User size={20} className="text-cyan-400 mb-3" />

              <p className="text-xs text-slate-500">Candidate</p>

              <p className="text-sm font-medium mt-1">
                {user.fullName || "Unknown"}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <Briefcase size={20} className="text-cyan-400 mb-3" />

              <p className="text-xs text-slate-500">Applied For</p>

              <p className="text-sm font-medium mt-1">
                {job.title || "Job unavailable"}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <CalendarDays size={20} className="text-cyan-400 mb-3" />

              <p className="text-xs text-slate-500">Applied On</p>

              <p className="text-sm font-medium mt-1">
                {new Date(
                  application.appliedAt || application.createdAt,
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            MAIN GRID
        ===================================== */}

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-8">
          {/* ===================================
              LEFT CONTENT
          =================================== */}

          <div className="space-y-8">
            {/* COVER LETTER */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold">Cover Letter</h2>

              {application.coverLetter ? (
                <p className="text-slate-300 leading-7 mt-5 whitespace-pre-line">
                  {application.coverLetter}
                </p>
              ) : (
                <p className="text-slate-500 mt-5">
                  The candidate did not provide a cover letter.
                </p>
              )}
            </section>

            {/* JOB */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={27} className="text-cyan-400" />
                  )}
                </div>

                <div>
                  <p className="text-sm text-cyan-400 font-semibold">
                    Job Opportunity
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {job.title || "Job unavailable"}
                  </h2>

                  <p className="text-slate-400 mt-1">{job.company}</p>
                </div>
              </div>

              {/* JOB META */}

              <div className="grid sm:grid-cols-2 gap-4 mt-7">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <MapPin size={19} className="text-cyan-400 mb-3" />

                  <p className="text-xs text-slate-500">Location</p>

                  <p className="text-sm mt-1">
                    {job.location || "Not specified"}
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <Briefcase size={19} className="text-cyan-400 mb-3" />

                  <p className="text-xs text-slate-500">Work Mode</p>

                  <p className="text-sm mt-1">
                    {job.workMode || "Not specified"}
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <Clock3 size={19} className="text-cyan-400 mb-3" />

                  <p className="text-xs text-slate-500">Experience</p>

                  <p className="text-sm mt-1">
                    {job.experience || "Not specified"}
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <IndianRupee size={19} className="text-cyan-400 mb-3" />

                  <p className="text-xs text-slate-500">Salary / Stipend</p>

                  <p className="text-sm mt-1">
                    {job.salary || "Not Disclosed"}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}

              {job.description && (
                <div className="border-t border-slate-800 mt-7 pt-7">
                  <h3 className="text-xl font-bold">About the Opportunity</h3>

                  <p className="text-slate-300 leading-7 mt-4 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              )}
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

          {/* ===================================
              ADMIN SIDEBAR
          =================================== */}

          <aside>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold">Application Status</h2>

              <p className="text-slate-400 text-sm leading-6 mt-3">
                Update the candidate's current recruitment stage.
              </p>

              {application.status === "Withdrawn" ? (
                <div className="mt-6 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-400">
                  <div className="flex items-center gap-2">
                    <XCircle size={19} />

                    <span className="font-medium">Withdrawn</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    This application was withdrawn by the student and can no
                    longer be processed.
                  </p>
                </div>
              ) : (
                <>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mt-6 mb-2">
                    Current Status
                  </label>

                  <select
                    value={application.status}
                    disabled={updating}
                    onChange={(event) => handleStatusChange(event.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  >
                    {editableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {updating && (
                    <div className="flex items-center gap-2 text-sm text-cyan-400 mt-3">
                      <Loader2 size={15} className="animate-spin" />
                      Updating status...
                    </div>
                  )}
                </>
              )}

              {/* SUCCESS */}

              {successMessage && (
                <div className="mt-5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />

                    <span>{successMessage}</span>
                  </div>
                </div>
              )}

              {/* ERROR */}

              {error && application && (
                <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              {/* APPLICATION INFO */}

              <div className="border-t border-slate-800 mt-6 pt-6">
                <p className="text-xs text-slate-500">Application ID</p>

                <p className="text-xs text-slate-300 mt-1 break-all">
                  {application._id}
                </p>
              </div>

              <div className="border-t border-slate-800 mt-5 pt-5">
                <p className="text-xs text-slate-500">Applied On</p>

                <p className="text-sm mt-1">
                  {new Date(
                    application.appliedAt || application.createdAt,
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default AdminApplicationDetails;

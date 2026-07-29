import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  MapPin,
  RotateCcw,
  XCircle,
} from "lucide-react";

import {
  getMyApplications,
  withdrawApplication,
} from "../services/applicationService";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [withdrawingId, setWithdrawingId] = useState(null);

  // =========================================
  // LOAD APPLICATIONS
  // =========================================

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications();

      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to load applications:", error);

      setError(
        error.response?.data?.message || "Failed to load your applications.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // =========================================
  // WITHDRAW APPLICATION
  // =========================================

  const handleWithdraw = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setWithdrawingId(applicationId);

      await withdrawApplication(applicationId);

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: "Withdrawn",
              }
            : application,
        ),
      );
    } catch (error) {
      console.error("Failed to withdraw application:", error);

      alert(error.response?.data?.message || "Failed to withdraw application.");
    } finally {
      setWithdrawingId(null);
    }
  };

  // =========================================
  // STATUS DESIGN
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
          Loading Applications...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* =====================================
            BACK
        ===================================== */}

        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={19} />
          Back to Jobs
        </button>

        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-cyan-400 font-semibold text-sm">
              Career Tracker
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              My Applications
            </h1>

            <p className="text-slate-400 mt-3">
              Track all your DevSphere job and internship applications.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
            <p className="text-xs text-slate-500">Total Applications</p>

            <p className="text-2xl font-bold text-cyan-400 mt-1">
              {applications.length}
            </p>
          </div>
        </div>

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
            {error}

            <button
              type="button"
              onClick={loadApplications}
              className="ml-4 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================
            EMPTY STATE
        ===================================== */}

        {!error && applications.length === 0 && (
          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <Briefcase size={30} className="text-cyan-400" />
            </div>

            <h2 className="text-2xl font-bold mt-5">No applications yet</h2>

            <p className="text-slate-400 mt-3 max-w-md mx-auto">
              Explore available jobs and internships and submit your first
              application.
            </p>

            <button
              onClick={() => navigate("/jobs")}
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
            >
              Explore Jobs
            </button>
          </div>
        )}

        {/* =====================================
            APPLICATION CARDS
        ===================================== */}

        {!error && applications.length > 0 && (
          <div className="space-y-5 mt-10">
            {applications.map((application) => {
              const job = application.job;

              if (!job) {
                return null;
              }

              const canWithdraw = ![
                "Selected",
                "Rejected",
                "Withdrawn",
              ].includes(application.status);

              return (
                <div
                  key={application._id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* JOB INFORMATION */}

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 size={26} className="text-cyan-400" />
                        )}
                      </div>

                      <div>
                        <h2 className="text-xl font-bold">{job.title}</h2>

                        <p className="text-slate-400 mt-1">{job.company}</p>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={15} />

                            {job.location}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Briefcase size={15} />

                            {job.jobType}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock3 size={15} />

                            {job.workMode || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS */}

                    <div className="lg:text-right">
                      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                        Application Status
                      </p>

                      <span
                        className={`inline-flex border px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(
                          application.status,
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM */}

                  <div className="border-t border-slate-800 mt-6 pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-5 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        Applied{" "}
                        {new Date(
                          application.appliedAt || application.createdAt,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      {application.status === "Selected" && (
                        <span className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 size={16} />
                          Congratulations!
                        </span>
                      )}
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="flex items-center gap-2 border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm transition"
                      >
                        <Eye size={16} />
                        View Job
                      </button>

                      {canWithdraw && (
                        <button
                          type="button"
                          onClick={() => handleWithdraw(application._id)}
                          disabled={withdrawingId === application._id}
                          className="flex items-center gap-2 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {withdrawingId === application._id ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Withdrawing...
                            </>
                          ) : (
                            <>
                              <XCircle size={16} />
                              Withdraw
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REFRESH */}

        {!error && applications.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={loadApplications}
              className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition"
            >
              <RotateCcw size={16} />
              Refresh Applications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;

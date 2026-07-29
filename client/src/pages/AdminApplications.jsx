import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Loader2,
  Search,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import {
  getAllApplications,
  getApplicationStats,
  updateApplicationStatus,
} from "../services/adminApplicationService";

const statuses = [
  "All",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
  "Withdrawn",
];

const editableStatuses = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllApplications({
        status: statusFilter,
        search,
      });

      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to load admin applications:", error);

      setError(error.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  // ==========================================
  // LOAD STATS
  // ==========================================

  const loadStats = useCallback(async () => {
    try {
      const data = await getApplicationStats();

      setStats(data.stats || null);
    } catch (error) {
      console.error("Failed to load application stats:", error);
    }
  }, []);

  // ==========================================
  // INITIAL / FILTER LOAD
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadApplications();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadApplications]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      const data = await updateApplicationStatus(applicationId, newStatus);

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId ? data.application : application,
        ),
      );

      await loadStats();

      // If filtering by a specific status,
      // remove the card after moving it elsewhere.
      if (statusFilter !== "All" && newStatus !== statusFilter) {
        setApplications((currentApplications) =>
          currentApplications.filter(
            (application) => application._id !== applicationId,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update application:", error);

      setError(
        error.response?.data?.message || "Failed to update application status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-[1500px] mx-auto">
        {/* ======================================
            HEADER
        ====================================== */}

        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={19} />
          Admin Dashboard
        </button>

        <div className="mt-8">
          <p className="text-cyan-400 font-semibold">Recruitment Management</p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">Applications</h1>

          <p className="text-slate-400 mt-3">
            Review candidates and manage their recruitment status.
          </p>
        </div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <Users className="text-cyan-400" size={24} />

            <p className="text-slate-500 text-sm mt-4">Total Applications</p>

            <p className="text-3xl font-bold mt-1">{stats?.total ?? 0}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <Clock3 className="text-yellow-400" size={24} />

            <p className="text-slate-500 text-sm mt-4">Under Review</p>

            <p className="text-3xl font-bold mt-1">{stats?.underReview ?? 0}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <UserCheck className="text-purple-400" size={24} />

            <p className="text-slate-500 text-sm mt-4">Shortlisted</p>

            <p className="text-3xl font-bold mt-1">{stats?.shortlisted ?? 0}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <CheckCircle2 className="text-green-400" size={24} />

            <p className="text-slate-500 text-sm mt-4">Selected</p>

            <p className="text-3xl font-bold mt-1">{stats?.selected ?? 0}</p>
          </div>
        </div>

        {/* ======================================
            FILTERS
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-8">
          <div className="flex flex-col xl:flex-row gap-5 xl:items-center">
            {/* SEARCH */}

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, email, job or company..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (
          <div className="flex justify-center items-center py-20 text-slate-400">
            <Loader2 size={24} className="animate-spin text-cyan-400 mr-3" />
            Loading applications...
          </div>
        )}

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {!loading && !error && applications.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 px-6 text-center mt-8">
            <FileText size={42} className="text-slate-600 mx-auto" />

            <h2 className="text-xl font-bold mt-5">No applications found</h2>

            <p className="text-slate-500 mt-2">
              No applications match the current filters.
            </p>
          </div>
        )}

        {/* ======================================
            APPLICATIONS
        ====================================== */}

        {!loading && applications.length > 0 && (
          <div className="space-y-5 mt-8">
            {applications.map((application) => {
              const user = application.user;
              const job = application.job;

              return (
                <div
                  key={application._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    {/* CANDIDATE */}

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold">
                          {user?.fullName || "Unknown Candidate"}
                        </h2>

                        <span
                          className={`border rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            application.status,
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <p className="text-slate-500 mt-1">
                        {user?.email || "Email unavailable"}
                      </p>

                      {/* JOB */}

                      <div className="mt-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Briefcase
                            size={20}
                            className="text-cyan-400 shrink-0 mt-0.5"
                          />

                          <div>
                            <p className="font-semibold">
                              {job?.title || "Job unavailable"}
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                              {job?.company}
                              {job?.location && ` • ${job.location}`}
                              {job?.jobType && ` • ${job.jobType}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-4">
                        Applied{" "}
                        {new Date(
                          application.appliedAt || application.createdAt,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="xl:w-72">
                      <label className="text-xs text-slate-500 uppercase tracking-wider">
                        Update Status
                      </label>

                      {application.status === "Withdrawn" ? (
                        <div className="mt-2 flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-500">
                          <XCircle size={17} />
                          Withdrawn by student
                        </div>
                      ) : (
                        <select
                          value={application.status}
                          disabled={updatingId === application._id}
                          onChange={(event) =>
                            handleStatusChange(
                              application._id,
                              event.target.value,
                            )
                          }
                          className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                        >
                          {editableStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}

                      {updatingId === application._id && (
                        <p className="flex items-center gap-2 text-xs text-cyan-400 mt-2">
                          <Loader2 size={13} className="animate-spin" />
                          Updating...
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/applications/${application._id}`)
                        }
                        className="w-full mt-3 flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-800 rounded-xl py-3 text-sm transition"
                      >
                        <Eye size={17} />
                        View Application
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApplications;

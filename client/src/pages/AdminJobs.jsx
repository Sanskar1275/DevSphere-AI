import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

import { getJobs, deleteJob } from "../services/jobService";

function AdminJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // =========================================
  // LOAD JOBS
  // =========================================

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs();

      setJobs(data);
    } catch (error) {
      console.error("Failed to load jobs:", error);

      setError(error.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJobs();
  }, []);

  // =========================================
  // DELETE JOB
  // =========================================

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}" at ${job.company}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(job._id);

      await deleteJob(job._id);

      setJobs((currentJobs) =>
        currentJobs.filter((currentJob) => currentJob._id !== job._id),
      );

      alert("✅ Job Deleted Successfully!");
    } catch (error) {
      console.error("Delete Job Error:", error);

      alert(error.response?.data?.message || "❌ Failed to Delete Job");
    } finally {
      setDeletingId(null);
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
          Loading Jobs...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">
        {/* BACK */}

        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={19} />
          Back to Admin Dashboard
        </button>

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <BriefcaseBusiness className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Manage Jobs</h1>

              <p className="text-slate-400 mt-1">
                Manage jobs and internships posted on DevSphere AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-job")}
            className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl font-semibold transition"
          >
            <Plus size={19} />
            Add Job
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* JOB COUNT */}

        <div className="mt-10">
          <p className="text-slate-400">
            Total Opportunities:{" "}
            <span className="text-white font-semibold">{jobs.length}</span>
          </p>
        </div>

        {/* EMPTY */}

        {jobs.length === 0 ? (
          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <BriefcaseBusiness size={45} className="text-slate-600 mx-auto" />

            <h2 className="text-xl font-bold mt-5">No Jobs Available</h2>

            <p className="text-slate-400 mt-2">
              Create your first job or internship opportunity.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 mt-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* JOB INFORMATION */}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold">{job.title}</h2>

                      <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full">
                        {job.jobType}
                      </span>
                    </div>

                    <p className="text-slate-400 mt-2">{job.company}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />

                        {job.location}
                      </div>

                      <span>{job.workMode}</span>

                      <span>{job.experience}</span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl transition"
                    >
                      <Edit3 size={17} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(job)}
                      disabled={deletingId === job._id}
                      className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl transition"
                    >
                      {deletingId === job._id ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}

                      {deletingId === job._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminJobs;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BriefcaseBusiness, Loader2 } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { getJobs } from "../services/jobService";

import JobSearchBar from "../components/jobs/JobSearchBar";
import JobFilters from "../components/jobs/JobFilters";
import JobGrid from "../components/jobs/JobGrid";

function Jobs() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [workMode, setWorkMode] = useState("All");

  // =========================================
  // LOAD JOBS
  // =========================================

  useEffect(() => {
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

    loadJobs();
  }, []);

  // =========================================
  // VIEW JOB
  // =========================================
  // Not logged in  -> Login
  // Logged in      -> Job Details
  // =========================================

  const handleViewJob = (jobId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate(`/jobs/${jobId}`);
  };

  // =========================================
  // FILTER JOBS
  // =========================================

  const filteredJobs = jobs.filter((job) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      job.title?.toLowerCase().includes(searchValue) ||
      job.company?.toLowerCase().includes(searchValue) ||
      job.location?.toLowerCase().includes(searchValue) ||
      job.skills?.some((skill) => skill.toLowerCase().includes(searchValue));

    const matchesJobType = jobType === "All" || job.jobType === jobType;

    const matchesWorkMode = workMode === "All" || job.workMode === workMode;

    return matchesSearch && matchesJobType && matchesWorkMode;
  });

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 size={24} className="animate-spin text-cyan-400" />

          <span>Loading Jobs...</span>
        </div>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-[1500px] mx-auto">
        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center shrink-0">
              <BriefcaseBusiness size={25} className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Jobs & Internships
              </h1>

              <p className="text-slate-400 mt-2">
                Discover opportunities that match your skills and career goals.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* =====================================
            SEARCH + FILTERS
        ===================================== */}

        <div className="flex flex-col xl:flex-row gap-4">
          <JobSearchBar search={search} setSearch={setSearch} />

          <JobFilters
            jobType={jobType}
            setJobType={setJobType}
            workMode={workMode}
            setWorkMode={setWorkMode}
          />
        </div>

        {/* =====================================
            RESULT COUNT
        ===================================== */}

        <div className="mt-7 flex items-center justify-between">
          <p className="text-slate-400">
            Showing{" "}
            <span className="text-white font-semibold">
              {filteredJobs.length}
            </span>{" "}
            {filteredJobs.length === 1 ? "opportunity" : "opportunities"}
          </p>
        </div>

        {/* =====================================
            JOB GRID
        ===================================== */}

        <JobGrid jobs={filteredJobs} onViewJob={handleViewJob} />
      </div>
    </div>
  );
}

export default Jobs;

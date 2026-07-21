import { BriefcaseBusiness, MapPin, ArrowRight, Building2 } from "lucide-react";

import { useNavigate } from "react-router-dom";

function LatestJobs({ jobs = [] }) {
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <BriefcaseBusiness size={24} className="text-cyan-400" />

          <div>
            <h2 className="text-2xl font-bold">Latest Opportunities</h2>

            <p className="text-sm text-slate-400 mt-1">
              Explore the newest jobs and internships.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/jobs")}
          className="text-sm text-cyan-400 hover:text-cyan-300 transition"
        >
          View All
        </button>
      </div>

      {/* NO JOBS */}

      {jobs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <BriefcaseBusiness size={40} className="text-slate-500 mx-auto" />

          <h3 className="text-lg font-semibold mt-4">
            No Opportunities Available
          </h3>

          <p className="text-slate-400 mt-2">
            New jobs and internships will appear here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 transition"
            >
              {/* TYPE + MODE */}

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">
                  {job.jobType || "Job"}
                </span>

                <span className="text-xs text-slate-400">
                  {job.workMode || "On-site"}
                </span>
              </div>

              {/* TITLE */}

              <h3 className="text-xl font-bold mt-5 line-clamp-2">
                {job.title}
              </h3>

              {/* COMPANY */}

              <div className="flex items-center gap-2 text-slate-400 mt-3">
                <Building2 size={17} />

                <span>{job.company}</span>
              </div>

              {/* LOCATION */}

              <div className="flex items-center gap-2 text-slate-400 mt-3">
                <MapPin size={17} />

                <span>{job.location || "Not specified"}</span>
              </div>

              {/* EXPERIENCE */}

              <div className="mt-5">
                <p className="text-xs text-slate-500">Experience</p>

                <p className="text-sm text-slate-300 mt-1">
                  {job.experience || "Fresher"}
                </p>
              </div>

              {/* SALARY */}

              <div className="mt-4">
                <p className="text-xs text-slate-500">Salary / Stipend</p>

                <p className="text-sm text-slate-300 mt-1">
                  {job.salary || "Not Disclosed"}
                </p>
              </div>

              {/* SKILLS */}

              {Array.isArray(job.skills) && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {job.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* VIEW JOB */}

              <button
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-slate-800 hover:bg-cyan-500 border border-slate-700 hover:border-cyan-500 py-3 rounded-xl font-semibold transition"
              >
                View Details
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestJobs;

import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">

      {/* TOP SECTION */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-4">

          {/* COMPANY LOGO */}

          <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">

            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2
                size={26}
                className="text-cyan-400"
              />
            )}

          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              {job.title}
            </h2>

            <p className="text-slate-400 mt-1">
              {job.company}
            </p>

          </div>

        </div>

        {/* JOB TYPE */}

        <span className="shrink-0 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium px-3 py-1.5 rounded-full">
          {job.jobType}
        </span>

      </div>

      {/* DESCRIPTION */}

      <p className="text-slate-400 mt-5 leading-6 line-clamp-2">
        {job.description}
      </p>

      {/* JOB INFORMATION */}

      <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm text-slate-300">

        <div className="flex items-center gap-2">
          <MapPin
            size={17}
            className="text-slate-500"
          />

          {job.location}
        </div>

        <div className="flex items-center gap-2">
          <Briefcase
            size={17}
            className="text-slate-500"
          />

          {job.workMode}
        </div>

        <div className="flex items-center gap-2">
          <Clock3
            size={17}
            className="text-slate-500"
          />

          {job.experience}
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee
            size={17}
            className="text-slate-500"
          />

          {job.salary}
        </div>

      </div>

      {/* SKILLS */}

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">

          {job.skills
            .slice(0, 4)
            .map((skill, index) => (
              <span
                key={index}
                className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg"
              >
                {skill}
              </span>
            ))}

          {job.skills.length > 4 && (
            <span className="bg-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-lg">
              +{job.skills.length - 4}
            </span>
          )}

        </div>
      )}

      {/* BOTTOM */}

      <div className="border-t border-slate-800 mt-6 pt-5 flex items-center justify-between">

        <span className="text-xs text-slate-500">
          {job.createdAt
            ? `Posted ${new Date(
                job.createdAt
              ).toLocaleDateString()}`
            : "Recently posted"}
        </span>

        <Link
          to={`/jobs/${job._id}`}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium text-sm transition"
        >
          View Details

          <ArrowRight size={16} />
        </Link>

      </div>

    </div>
  );
}

export default JobCard;
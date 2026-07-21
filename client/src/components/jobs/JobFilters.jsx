import { SlidersHorizontal } from "lucide-react";

function JobFilters({
  jobType,
  setJobType,
  workMode,
  setWorkMode,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <SlidersHorizontal
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />

        <select
          value={jobType}
          onChange={(e) =>
            setJobType(e.target.value)
          }
          className="bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-10 pr-8 text-slate-300 outline-none focus:border-cyan-500"
        >
          <option value="All">
            All Job Types
          </option>

          <option value="Full-time">
            Full-time
          </option>

          <option value="Part-time">
            Part-time
          </option>

          <option value="Internship">
            Internship
          </option>

          <option value="Contract">
            Contract
          </option>
        </select>
      </div>

      <select
        value={workMode}
        onChange={(e) =>
          setWorkMode(e.target.value)
        }
        className="bg-slate-900 border border-slate-800 rounded-xl py-3.5 px-4 text-slate-300 outline-none focus:border-cyan-500"
      >
        <option value="All">
          All Work Modes
        </option>

        <option value="Remote">
          Remote
        </option>

        <option value="Hybrid">
          Hybrid
        </option>

        <option value="On-site">
          On-site
        </option>
      </select>
    </div>
  );
}

export default JobFilters;
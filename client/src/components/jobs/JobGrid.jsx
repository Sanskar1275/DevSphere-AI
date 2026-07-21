import JobCard from "./JobCard";

function JobGrid({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className="mt-16 text-center">
        <div className="text-5xl mb-4">
          💼
        </div>

        <h3 className="text-xl font-semibold text-white">
          No jobs found
        </h3>

        <p className="text-slate-400 mt-2">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-10">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
        />
      ))}
    </div>
  );
}

export default JobGrid;
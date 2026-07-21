import { Search } from "lucide-react";

function JobSearchBar({
  search,
  setSearch,
}) {
  return (
    <div className="relative flex-1">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      />

      <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search jobs, companies or skills..."
        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
      />
    </div>
  );
}

export default JobSearchBar;
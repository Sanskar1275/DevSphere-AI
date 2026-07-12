function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search Courses..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full md:w-96 px-5 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none"
    />
  );
}

export default SearchBar;
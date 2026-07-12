const categories = [
  "All",
  "Frontend",
  "Backend",
  "AI",
  "DSA",
  "Database",
];

function CategoryFilter({ category, setCategory }) {
  return (
    <div className="flex flex-wrap gap-3">

      {categories.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(item)}
          className={`px-5 py-2 rounded-xl transition ${
            category === item
              ? "bg-cyan-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {item}
        </button>
      ))}

    </div>
  );
}

export default CategoryFilter;
function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-cyan-400 transition duration-300 hover:-translate-y-2">

      <div className="text-5xl mb-5">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="text-slate-400 mt-4">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;
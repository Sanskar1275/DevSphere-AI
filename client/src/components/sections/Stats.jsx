function Stats() {
  return (
    <section className="bg-slate-900 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

        <div>
          <h2 className="text-4xl font-bold text-cyan-400">10K+</h2>
          <p className="text-slate-300 mt-2">Students</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-cyan-400">250+</h2>
          <p className="text-slate-300 mt-2">Courses</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-cyan-400">500+</h2>
          <p className="text-slate-300 mt-2">Projects</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-cyan-400">98%</h2>
          <p className="text-slate-300 mt-2">Placement Rate</p>
        </div>

      </div>
    </section>
  );
}

export default Stats;
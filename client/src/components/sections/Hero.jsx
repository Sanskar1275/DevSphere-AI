function Hero() {
  return (
    <section className="bg-slate-950 text-white min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <p className="inline-block bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full border border-cyan-500/30">
          🚀 Trusted by 10,000+ Developers
        </p>

        <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight">
          Learn.
          <span className="text-cyan-400"> Build.</span>
          <br />
          Get Hired.
        </h1>

        <p className="mt-8 text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto">
          Master Full Stack Development, AI, DSA, and prepare for your dream
          company with DevSphere AI.
        </p>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-5">

          <button className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl font-semibold transition">
            Get Started
          </button>

          <button className="border border-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-4 rounded-xl transition">
            Explore Courses
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;
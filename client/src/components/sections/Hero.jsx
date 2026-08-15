import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-slate-950 text-white min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 text-center w-full">
        {/* ========================================
            TRUST BADGE
        ======================================== */}

        <p
          className="
            inline-block
            bg-cyan-500/10
            text-cyan-400
            px-4
            py-2
            rounded-full
            border
            border-cyan-500/30
          "
        >
          🚀 Trusted by 10,000+ Developers
        </p>

        {/* ========================================
            HERO HEADING
        ======================================== */}

        <h1
          className="
            mt-8
            text-5xl
            md:text-7xl
            font-extrabold
            leading-tight
          "
        >
          Learn.
          <span className="text-cyan-400"> Build.</span>
          <br />
          Get Hired.
        </h1>

        {/* ========================================
            HERO DESCRIPTION
        ======================================== */}

        <p
          className="
            mt-8
            text-lg
            md:text-2xl
            text-slate-300
            max-w-3xl
            mx-auto
          "
        >
          Master Full Stack Development, AI, DSA, and prepare for your dream
          company with DevSphere AI.
        </p>

        {/* ========================================
            ACTION BUTTONS
        ======================================== */}

        <div
          className="
            mt-10
            flex
            flex-col
            sm:flex-row
            justify-center
            items-center
            gap-5
          "
        >
          {/* ======================================
              GET STARTED
              → LOGIN
          ====================================== */}

          <Link
            to="/login"
            className="
              inline-flex
              items-center
              justify-center
              px-8
              py-4
              min-w-[160px]
              rounded-xl
              border
              border-cyan-400
              bg-transparent
              text-white
              font-semibold
              hover:bg-cyan-500
              hover:border-cyan-500
              hover:text-white
              transition-colors
              duration-200
              cursor-pointer
            "
          >
            Get Started
          </Link>

          {/* ======================================
              EXPLORE COURSES
              → COURSES
          ====================================== */}

          <Link
            to="/courses"
            className="
              inline-flex
              items-center
              justify-center
              px-8
              py-4
              min-w-[160px]
              rounded-xl
              border
              border-cyan-400
              bg-transparent
              text-white
              font-semibold
              hover:bg-cyan-500
              hover:border-cyan-500
              hover:text-white
              transition-colors
              duration-200
              cursor-pointer
            "
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;

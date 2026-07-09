import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-950 text-white px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-bold text-cyan-400">DevSphere AI</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-lg">
          <li>
            <Link to="/" className="hover:text-cyan-400 transition">
              Home
            </Link>
          </li>

          <li>
            <Link to="/courses" className="hover:text-cyan-400 transition">
              Courses
            </Link>
          </li>

          <li>
            <Link to="/jobs" className="hover:text-cyan-400 transition">
              Jobs
            </Link>
          </li>

          <li>
            <Link to="/login" className="hover:text-cyan-400 transition">
              Login
            </Link>
          </li>
        </ul>

        {/* Desktop Login */}
        <button className="hidden md:block bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-xl font-semibold">
          Login
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cyan-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-5 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700">
          <ul className="flex flex-col gap-5 text-center text-lg">
            <li className="hover:text-cyan-400 cursor-pointer"><Link to="/">Home</Link></li>

            <li className="hover:text-cyan-400 cursor-pointer"><Link to="/features">Features</Link></li>

            <li className="hover:text-cyan-400 cursor-pointer"><Link to="/courses">Courses</Link></li>

            <li className="hover:text-cyan-400 cursor-pointer"><Link to="/jobs">Jobs</Link></li>

            <li className="hover:text-cyan-400 cursor-pointer"><Link to="/about">About</Link></li>
          </ul>

          <button className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-semibold">
          <Link to="/login">Login</Link>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

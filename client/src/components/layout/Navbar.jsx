import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // ==========================================
  // NAVIGATION LINKS
  // ==========================================

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Courses",
      path: "/courses",
    },
    {
      name: "Jobs",
      path: "/jobs",
    },
    {
      name: "Login",
      path: "/login",
    },
  ];

  return (
    <nav className="bg-slate-950 text-white px-4 sm:px-6 py-5 border-b border-slate-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ========================================
            LOGO
        ======================================== */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-cyan-400
            hover:text-cyan-300
            transition-colors
            duration-200
          "
        >
          DevSphere AI
        </Link>

        {/* ========================================
            DESKTOP NAVIGATION
        ======================================== */}

        <ul className="hidden md:flex items-center gap-8 text-lg">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="
                  text-white
                  hover:text-cyan-400
                  transition-colors
                  duration-200
                "
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* ========================================
            DESKTOP LOGIN BUTTON
        ======================================== */}

        <Link
          to="/login"
          className="
            hidden
            md:inline-flex
            items-center
            justify-center
            bg-cyan-500
            hover:bg-cyan-600
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            transition-all
            duration-200
            hover:shadow-lg
            hover:shadow-cyan-500/20
          "
        >
          Login
        </Link>

        {/* ========================================
            MOBILE MENU BUTTON
        ======================================== */}

        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          className="
            md:hidden
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
            text-cyan-400
            bg-slate-900
            border
            border-slate-800
            hover:bg-slate-800
            transition-colors
            duration-200
          "
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ========================================
          MOBILE MENU
      ======================================== */}

      {isOpen && (
        <div
          className="
            md:hidden
            mt-5
            bg-slate-900
            rounded-2xl
            p-6
            shadow-2xl
            border
            border-slate-800
          "
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={closeMobileMenu}
                  className="
                    block
                    px-4
                    py-3
                    rounded-xl
                    text-center
                    text-slate-300
                    hover:bg-slate-800
                    hover:text-cyan-400
                    transition-all
                    duration-200
                  "
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

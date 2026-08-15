import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles,
  Target,
  MessageSquare,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Sidebar({ mobileOpen = false, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    if (onClose) {
      onClose();
    }

    navigate("/login");
  };

  // ==========================================
  // MAIN NAVIGATION
  // ==========================================

  const mainMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "AI Mentor",
      path: "/mentor",
      icon: Bot,
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: Briefcase,
    },
    {
      name: "Recommended Jobs",
      path: "/jobs/recommended",
      icon: Target,
    },
    {
      name: "Resume",
      path: "/resume",
      icon: FileText,
    },
    {
      name: "Interview",
      path: "/interview",
      icon: MessageSquare,
    },
  ];

  // ==========================================
  // TOOLS
  // ==========================================

  const toolsMenuItems = [
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  // ==========================================
  // NAVIGATION LINK
  // ==========================================

  const renderNavLink = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.name}
        to={item.path}
        end={item.path === "/jobs" || item.path === "/interview"}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/10"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`
        }
      >
        <Icon size={21} className="shrink-0" />

        <span className="font-medium truncate">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* ==========================================
          SIDEBAR BACKDROP
      ========================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
          "
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50

          w-72
          h-screen

          bg-slate-900
          border-r border-slate-800

          flex
          flex-col

          transform
          transition-transform
          duration-300
          ease-in-out

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ==========================================
            LOGO
        ========================================== */}

        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-cyan-500/10
                  border border-cyan-500/20
                  flex items-center justify-center
                  shrink-0
                "
              >
                <Sparkles size={21} className="text-cyan-400" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white whitespace-nowrap">
                  DevSphere
                  <span className="text-cyan-400"> AI</span>
                </h1>

                <p className="text-xs text-slate-500 mt-0.5">
                  Developer Platform
                </p>
              </div>
            </div>

            {/* ========================================
                CLOSE BUTTON
            ======================================== */}

            <button
              type="button"
              onClick={onClose}
              className="
                w-9 h-9
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-400
                hover:bg-slate-800
                hover:text-white
                transition
                shrink-0
              "
              aria-label="Close sidebar"
              title="Close Sidebar"
            >
              <X size={21} />
            </button>
          </div>
        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="flex-1 p-5 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>

          <div className="space-y-2">{mainMenuItems.map(renderNavLink)}</div>

          {/* ========================================
              TOOLS
          ======================================== */}

          <div className="mt-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
              Tools
            </p>

            <div className="space-y-2">{toolsMenuItems.map(renderNavLink)}</div>
          </div>

          {/* ========================================
              ADMIN
          ======================================== */}

          {user?.role === "admin" && (
            <div className="mt-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
                Administration
              </p>

              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <ShieldCheck size={21} className="shrink-0" />

                <span className="font-medium">Admin Dashboard</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* ==========================================
            USER + LOGOUT
        ========================================== */}

        <div className="p-5 border-t border-slate-800">
          {user && (
            <div className="px-4 pb-4 mb-3 border-b border-slate-800">
              <p className="text-sm font-semibold text-white truncate">
                {user.fullName}
              </p>

              <p className="text-xs text-slate-500 capitalize mt-1">
                {user.role || "student"}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              items-center
              gap-4
              w-full
              px-4
              py-3
              rounded-xl
              text-red-400
              hover:bg-red-500/10
              hover:text-red-300
              transition-all
            "
          >
            <LogOut size={21} className="shrink-0" />

            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

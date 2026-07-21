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
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function Sidebar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  // =========================================
  // MAIN NAVIGATION
  // =========================================

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
  ];

  // =========================================
  // FUTURE FEATURES
  // =========================================

  const futureMenuItems = [
    {
      name: "Resume",
      icon: FileText,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      {/* =========================================
          LOGO
      ========================================= */}

      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Sparkles size={21} className="text-cyan-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              DevSphere
              <span className="text-cyan-400"> AI</span>
            </h1>

            <p className="text-xs text-slate-500 mt-0.5">Developer Platform</p>
          </div>
        </div>
      </div>

      {/* =========================================
          NAVIGATION
      ========================================= */}

      <nav className="flex-1 p-5 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>

        <div className="space-y-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={21} />

                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* =========================================
            TOOLS
        ========================================= */}

        <div className="mt-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Tools
          </p>

          <div className="space-y-2">
            {futureMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  type="button"
                  disabled
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-slate-600 cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <Icon size={21} />

                    <span className="font-medium">{item.name}</span>
                  </div>

                  <span className="text-[10px] bg-slate-800 px-2 py-1 rounded-md text-slate-500">
                    SOON
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================
            ADMIN
        ========================================= */}

        {user?.role === "admin" && (
          <div className="mt-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
              Administration
            </p>

            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <ShieldCheck size={21} />

              <span className="font-medium">Admin Dashboard</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* =========================================
          USER + LOGOUT
      ========================================= */}

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
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut size={21} />

          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

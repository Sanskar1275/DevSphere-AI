import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={22} />,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: <BookOpen size={22} />,
    },
    {
      name: "AI Mentor",
      path: "/mentor",
      icon: <Bot size={22} />,
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: <Briefcase size={22} />,
    },
    {
      name: "Resume",
      path: "/resume",
      icon: <FileText size={22} />,
    },
    {
      name: "Admin",
      path: "/admin",
      icon: <ShieldCheck size={22} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={22} />,
    },
  ];

  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-cyan-400">
          DevSphere AI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-3">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">
              {item.name}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-slate-800">

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut size={22} />
          <span className="font-medium">
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
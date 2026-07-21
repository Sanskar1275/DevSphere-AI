import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Users,
  BarChart3,
  PlusCircle,
  BriefcaseBusiness,
  ListChecks,
} from "lucide-react";

import { getAdminStats } from "../services/adminDashboardService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  // =========================================
  // LOAD ADMIN STATS
  // =========================================

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();

        setStats(data);
      } catch (error) {
        console.error(
          "Failed to load admin stats:",
          error
        );
      }
    };

    fetchStats();
  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (!stats) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex justify-center items-center">
        Loading Admin Dashboard...
      </div>
    );
  }

  // =========================================
  // QUICK ACTIONS
  // =========================================

  const cards = [
    {
      title: "Add Course",
      description:
        "Create a brand new course",
      icon: <PlusCircle size={36} />,
      action: () =>
        navigate("/admin/add-course"),
    },

    {
      title: "Manage Courses",
      description:
        "Edit or delete existing courses",
      icon: <BookOpen size={36} />,
      action: () =>
        navigate("/admin/courses"),
    },

    {
      title: "Add Job",
      description:
        "Post a new job or internship",
      icon: (
        <BriefcaseBusiness size={36} />
      ),
      action: () =>
        navigate("/admin/add-job"),
    },

    {
      title: "Manage Jobs",
      description:
        "Edit or delete job opportunities",
      icon: <ListChecks size={36} />,
      action: () =>
        navigate("/admin/jobs"),
    },

    {
      title: "Manage Users",
      description: "Coming Soon",
      icon: <Users size={36} />,
      action: () =>
        alert("🚧 Coming Soon"),
    },

    {
      title: "Analytics",
      description: "Coming Soon",
      icon: <BarChart3 size={36} />,
      action: () =>
        alert("🚧 Coming Soon"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-[1500px] mx-auto">

        {/* HEADER */}

        <h1 className="text-4xl md:text-5xl font-bold">
          👨‍💼 Admin Dashboard
        </h1>

        <p className="text-slate-400 mt-3 text-lg">
          Welcome back, Sanskar 👋
        </p>

        <p className="text-slate-500 mt-1">
          Manage your DevSphere AI platform
          from here.
        </p>

        {/* STATS */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-slate-400">
              Courses
            </h2>

            <p className="text-4xl font-bold text-cyan-400 mt-2">
              {stats.totalCourses}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-slate-400">
              Students
            </h2>

            <p className="text-4xl font-bold text-cyan-400 mt-2">
              {stats.totalUsers}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-slate-400">
              Active Courses
            </h2>

            <p className="text-4xl font-bold text-cyan-400 mt-2">
              {stats.publishedCourses}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-slate-400">
              Rating
            </h2>

            <p className="text-4xl font-bold text-cyan-400 mt-2">
              4.9 ⭐
            </p>
          </div>

        </div>

        {/* QUICK ACTIONS */}

        <h2 className="text-3xl font-bold mt-14 mb-8">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {cards.map((card) => (
            <div
              key={card.title}
              onClick={card.action}
              className="cursor-pointer bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-400 hover:scale-[1.02] transition-all duration-300 p-8"
            >
              <div className="text-cyan-400">
                {card.icon}
              </div>

              <h2 className="text-2xl font-bold mt-6">
                {card.title}
              </h2>

              <p className="text-slate-400 mt-3">
                {card.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
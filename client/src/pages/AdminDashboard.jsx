import { useNavigate } from "react-router-dom";
import { BookOpen, Users, BarChart3, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminStats } from "../services/adminDashboardService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex justify-center items-center">
        Loading Admin Dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "Add Course",
      description: "Create a brand new course",
      icon: <PlusCircle size={36} />,
      action: () => navigate("/admin/add-course"),
    },
    {
      title: "Manage Courses",
      description: "Edit or delete existing courses",
      icon: <BookOpen size={36} />,
      action: () => navigate("/admin/courses"),
    },
    {
      title: "Manage Users",
      description: "Coming Soon",
      icon: <Users size={36} />,
      action: () => alert("🚧 Coming Soon"),
    },
    {
      title: "Analytics",
      description: "Coming Soon",
      icon: <BarChart3 size={36} />,
      action: () => alert("🚧 Coming Soon"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-5xl font-bold">👨‍💼 Admin Dashboard</h1>

      <p className="text-slate-400 mt-3 text-lg">Welcome back, Sanskar 👋</p>

      <p className="text-slate-500">
        Manage your DevSphere AI platform from here.
      </p>

      {/* Stats */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-slate-400">Courses</h2>
          <p className="text-4xl font-bold text-cyan-400 mt-2">{stats.totalCourses}</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-slate-400">Students</h2>
          <p className="text-4xl font-bold text-cyan-400 mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-slate-400">Active Users</h2>
          <p className="text-4xl font-bold text-cyan-400 mt-2">{stats.publishedCourses}</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-slate-400">Rating</h2>
          <p className="text-4xl font-bold text-cyan-400 mt-2">4.9 ⭐</p>
        </div>
      </div>

      {/* Quick Actions */}

      <h2 className="text-3xl font-bold mt-14 mb-8">Quick Actions</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={card.action}
            className="cursor-pointer bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-400 hover:scale-[1.02] transition-all duration-300 p-8"
          >
            <div className="text-cyan-400">{card.icon}</div>

            <h2 className="text-2xl font-bold mt-6">{card.title}</h2>

            <p className="text-slate-400 mt-3">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

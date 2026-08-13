import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Users,
  BarChart3,
  PlusCircle,
  BriefcaseBusiness,
  ListChecks,
  ClipboardList,
  GraduationCap,
  UserCog,
  ShieldCheck,
  Briefcase,
  FileCheck2,
  BrainCircuit,
  Star,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getAdminStats } from "../services/adminDashboardService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD ADMIN STATS
  // =========================================

  const fetchStats = async () => {
    try {
      setLoading(true);

      const data = await getAdminStats();

      setStats(data);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center">
        <Loader2 size={45} className="animate-spin text-cyan-400" />

        <p className="text-slate-400 mt-4">Loading Admin Dashboard...</p>
      </div>
    );
  }

  // =========================================
  // ERROR / NO DATA
  // =========================================

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <BarChart3 size={30} className="text-red-400" />
        </div>

        <h2 className="text-2xl font-bold mt-5">Unable to Load Dashboard</h2>

        <p className="text-slate-500 mt-2">
          We couldn't retrieve the latest admin statistics.
        </p>

        <button
          type="button"
          onClick={fetchStats}
          className="mt-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold transition-all"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  // =========================================
  // STAT CARDS
  // =========================================

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers ?? 0,
      description: "All registered users",
      icon: Users,
    },

    {
      title: "Students",
      value: stats.totalStudents ?? 0,
      description: "Student accounts",
      icon: GraduationCap,
    },

    {
      title: "Recruiters",
      value: stats.totalRecruiters ?? 0,
      description: "Recruiter accounts",
      icon: BriefcaseBusiness,
    },

    {
      title: "Admins",
      value: stats.totalAdmins ?? 0,
      description: "Administrator accounts",
      icon: ShieldCheck,
    },

    {
      title: "Courses",
      value: stats.totalCourses ?? 0,
      description: "Total courses",
      icon: BookOpen,
    },

    {
      title: "Active Jobs",
      value: stats.activeJobs ?? 0,
      description: `${stats.totalJobs ?? 0} total jobs`,
      icon: Briefcase,
    },

    {
      title: "Applications",
      value: stats.totalApplications ?? 0,
      description: "Total applications",
      icon: FileCheck2,
    },

    {
      title: "AI Interviews",
      value: stats.totalInterviews ?? 0,
      description: `${stats.completedInterviews ?? 0} completed`,
      icon: BrainCircuit,
    },
  ];

  // =========================================
  // QUICK ACTIONS
  // =========================================

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
      title: "Add Job",
      description: "Post a new job or internship",
      icon: <BriefcaseBusiness size={36} />,
      action: () => navigate("/admin/add-job"),
    },

    {
      title: "Manage Jobs",
      description: "Edit or delete job opportunities",
      icon: <ListChecks size={36} />,
      action: () => navigate("/admin/jobs"),
    },

    {
      title: "Manage Applications",
      description: "Review applicants and update application status",
      icon: <ClipboardList size={36} />,
      action: () => navigate("/admin/applications"),
    },

    {
      title: "Manage Users",
      description: "View, manage and control user accounts",
      icon: <Users size={36} />,
      action: () => navigate("/admin/users"),
    },

    {
      title: "Analytics",
      description: "View platform performance and insights",
      icon: <BarChart3 size={36} />,
      action: () => navigate("/admin/analytics"),
    },
  ];

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[150px]" />
      </div>

      <div className="max-w-[1500px] mx-auto">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <ShieldCheck size={29} className="text-cyan-400" />
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-black">
                  Admin Dashboard
                </h1>

                <p className="text-slate-400 mt-2 text-lg">
                  Welcome back, Admin 👋
                </p>
              </div>
            </div>

            <p className="text-slate-500 mt-3">
              Manage and monitor your DevSphere AI platform from one place.
            </p>
          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="self-start md:self-center flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-white text-slate-400 transition-all"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Stats
          </button>
        </div>

        {/* =====================================
            OVERVIEW
        ===================================== */}

        <div className="flex items-center gap-3 mt-12">
          <BarChart3 size={24} className="text-cyan-400" />

          <h2 className="text-2xl font-bold">Platform Overview</h2>
        </div>

        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{card.title}</p>

                    <p className="text-4xl font-black text-cyan-400 mt-2">
                      {card.value}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center">
                    <Icon size={21} className="text-cyan-400" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-4">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* =====================================
            COURSE INSIGHT
        ===================================== */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <BookOpen size={21} className="text-violet-400" />
                </div>

                <div>
                  <h3 className="font-bold">Course Overview</h3>

                  <p className="text-sm text-slate-500">
                    Course platform status
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/courses")}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                Manage →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <p className="text-sm text-slate-500">Total Courses</p>

                <p className="text-3xl font-bold mt-2">
                  {stats.totalCourses ?? 0}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <p className="text-sm text-slate-500">Published</p>

                <p className="text-3xl font-bold text-emerald-400 mt-2">
                  {stats.publishedCourses ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* RATING */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Star size={21} className="text-amber-400" />
                </div>

                <div>
                  <h3 className="font-bold">Course Rating</h3>

                  <p className="text-sm text-slate-500">
                    Average platform rating
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-5xl font-black text-amber-400">
                {stats.averageRating ?? 0}
              </span>

              <span className="text-2xl mb-1">⭐</span>
            </div>

            <p className="text-sm text-slate-500 mt-3">
              Based on available course ratings.
            </p>
          </div>
        </div>

        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <div className="flex items-center gap-3 mt-14 mb-8">
          <ListChecks size={25} className="text-cyan-400" />

          <h2 className="text-3xl font-bold">Quick Actions</h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={card.action}
              className="text-left bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-400 hover:bg-slate-800/70 hover:-translate-y-1 transition-all duration-300 p-8 group"
            >
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
                {card.icon}
              </div>

              <h2 className="text-2xl font-bold mt-6">{card.title}</h2>

              <p className="text-slate-400 mt-3 leading-6">
                {card.description}
              </p>

              <div className="mt-6 text-sm text-cyan-400 font-medium">
                Open →
              </div>
            </button>
          ))}
        </div>

        {/* =====================================
            ADMIN NOTE
        ===================================== */}

        <div className="mt-10 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-cyan-500/5 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <UserCog size={21} className="text-cyan-400" />
            </div>

            <div>
              <h3 className="font-bold">Administrator Controls</h3>

              <p className="text-slate-500 text-sm mt-1 leading-6">
                Use the management modules above to control users, courses, jobs
                and applications across DevSphere AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

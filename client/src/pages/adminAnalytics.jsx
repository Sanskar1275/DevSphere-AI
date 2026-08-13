import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart3,
  Users,
  GraduationCap,
  BriefcaseBusiness,
  ShieldCheck,
  BookOpen,
  Briefcase,
  FileCheck2,
  BrainCircuit,
  Star,
  ArrowLeft,
  RefreshCw,
  Loader2,
  TrendingUp,
  Activity,
} from "lucide-react";

import { getAdminStats } from "../services/adminDashboardService";

function AdminAnalytics() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ANALYTICS
  // ==========================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const data = await getAdminStats();

      setStats(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <Loader2 size={48} className="animate-spin text-cyan-400" />

        <p className="text-slate-400 mt-5">Loading platform analytics...</p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <BarChart3 size={30} className="text-red-400" />
        </div>

        <h2 className="text-2xl font-bold mt-5">Unable to Load Analytics</h2>

        <p className="text-slate-500 mt-2 max-w-md">
          We couldn't retrieve the latest platform statistics.
        </p>

        <button
          type="button"
          onClick={fetchAnalytics}
          className="mt-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold transition-all"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // USER TOTAL
  // ==========================================

  const totalUsers = stats.totalUsers || 0;

  const studentPercentage =
    totalUsers > 0 ? Math.round((stats.totalStudents / totalUsers) * 100) : 0;

  const recruiterPercentage =
    totalUsers > 0 ? Math.round((stats.totalRecruiters / totalUsers) * 100) : 0;

  const adminPercentage =
    totalUsers > 0 ? Math.round((stats.totalAdmins / totalUsers) * 100) : 0;

  // ==========================================
  // APPLICATION / JOB RATIO
  // ==========================================

  const applicationPerJob =
    stats.totalJobs > 0
      ? (stats.totalApplications / stats.totalJobs).toFixed(1)
      : 0;

  // ==========================================
  // INTERVIEW COMPLETION
  // ==========================================

  const interviewCompletionRate =
    stats.totalInterviews > 0
      ? Math.round((stats.completedInterviews / stats.totalInterviews) * 100)
      : 0;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[150px]" />
      </div>

      <div className="max-w-[1500px] mx-auto">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <BarChart3 size={29} className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-black">
                Platform Analytics
              </h1>

              <p className="text-slate-400 mt-2">
                Monitor DevSphere AI platform performance and activity.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ======================================
            OVERVIEW
        ====================================== */}

        <div className="flex items-center gap-3 mt-12">
          <Activity size={24} className="text-cyan-400" />

          <h2 className="text-2xl font-bold">Platform Overview</h2>
        </div>

        {/* ======================================
            TOP STAT CARDS
        ====================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {/* USERS */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>

                <p className="text-4xl font-black text-cyan-400 mt-2">
                  {totalUsers}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Users size={21} className="text-cyan-400" />
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              Registered platform users
            </p>
          </div>

          {/* COURSES */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/40 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">Total Courses</p>

                <p className="text-4xl font-black text-violet-400 mt-2">
                  {stats.totalCourses || 0}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <BookOpen size={21} className="text-violet-400" />
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              Available learning resources
            </p>
          </div>

          {/* JOBS */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">Active Jobs</p>

                <p className="text-4xl font-black text-emerald-400 mt-2">
                  {stats.activeJobs || 0}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Briefcase size={21} className="text-emerald-400" />
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              Out of {stats.totalJobs || 0} total jobs
            </p>
          </div>

          {/* APPLICATIONS */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">Applications</p>

                <p className="text-4xl font-black text-amber-400 mt-2">
                  {stats.totalApplications || 0}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <FileCheck2 size={21} className="text-amber-400" />
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              Total submitted applications
            </p>
          </div>
        </div>

        {/* ======================================
            USER ANALYTICS
        ====================================== */}

        <section className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <Users size={23} className="text-cyan-400" />

            <h2 className="text-2xl font-bold">User Analytics</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* STUDENTS */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <GraduationCap size={21} className="text-cyan-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Students</p>

                    <p className="text-sm text-slate-500">
                      {studentPercentage}% of users
                    </p>
                  </div>
                </div>

                <span className="text-2xl font-bold text-cyan-400">
                  {stats.totalStudents || 0}
                </span>
              </div>

              <div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${studentPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* RECRUITERS */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <BriefcaseBusiness size={21} className="text-violet-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Recruiters</p>

                    <p className="text-sm text-slate-500">
                      {recruiterPercentage}% of users
                    </p>
                  </div>
                </div>

                <span className="text-2xl font-bold text-violet-400">
                  {stats.totalRecruiters || 0}
                </span>
              </div>

              <div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${recruiterPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* ADMINS */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <ShieldCheck size={21} className="text-red-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Administrators</p>

                    <p className="text-sm text-slate-500">
                      {adminPercentage}% of users
                    </p>
                  </div>
                </div>

                <span className="text-2xl font-bold text-red-400">
                  {stats.totalAdmins || 0}
                </span>
              </div>

              <div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${adminPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================
            JOB & APPLICATION ANALYTICS
        ====================================== */}

        <section className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <BriefcaseBusiness size={23} className="text-emerald-400" />

            <h2 className="text-2xl font-bold">Jobs & Applications</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* TOTAL JOBS */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-500 text-sm">Total Jobs</p>

              <p className="text-4xl font-black text-emerald-400 mt-2">
                {stats.totalJobs || 0}
              </p>

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-slate-500">Active</span>

                <span className="text-emerald-400 font-semibold">
                  {stats.activeJobs || 0}
                </span>
              </div>
            </div>

            {/* APPLICATIONS */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-500 text-sm">Total Applications</p>

              <p className="text-4xl font-black text-amber-400 mt-2">
                {stats.totalApplications || 0}
              </p>

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-slate-500">Applications / Job</span>

                <span className="text-amber-400 font-semibold">
                  {applicationPerJob}
                </span>
              </div>
            </div>

            {/* JOB ACTIVITY */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-500 text-sm">Job Activity</p>

              <p className="text-4xl font-black text-cyan-400 mt-2">
                {stats.totalJobs > 0
                  ? Math.round((stats.activeJobs / stats.totalJobs) * 100)
                  : 0}
                %
              </p>

              <p className="text-sm text-slate-500 mt-4">
                Jobs currently active
              </p>
            </div>
          </div>
        </section>

        {/* ======================================
            INTERVIEW ANALYTICS
        ====================================== */}

        <section className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit size={23} className="text-violet-400" />

            <h2 className="text-2xl font-bold">AI Interview Analytics</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* TOTAL */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Total Interviews</p>

                  <p className="text-4xl font-black text-violet-400 mt-2">
                    {stats.totalInterviews || 0}
                  </p>
                </div>

                <BrainCircuit size={30} className="text-violet-400" />
              </div>
            </div>

            {/* COMPLETED */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Completed Interviews</p>

                  <p className="text-4xl font-black text-emerald-400 mt-2">
                    {stats.completedInterviews || 0}
                  </p>
                </div>

                <Activity size={30} className="text-emerald-400" />
              </div>
            </div>

            {/* COMPLETION RATE */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Completion Rate</p>

                  <p className="text-4xl font-black text-cyan-400 mt-2">
                    {interviewCompletionRate}%
                  </p>
                </div>

                <TrendingUp size={30} className="text-cyan-400" />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================
            COURSE ANALYTICS
        ====================================== */}

        <section className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={23} className="text-violet-400" />

            <h2 className="text-2xl font-bold">Course Analytics</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* COURSES */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-500 text-sm">Total Courses</p>

              <p className="text-4xl font-black text-violet-400 mt-2">
                {stats.totalCourses || 0}
              </p>
            </div>

            {/* PUBLISHED */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-500 text-sm">Published Courses</p>

              <p className="text-4xl font-black text-emerald-400 mt-2">
                {stats.publishedCourses || 0}
              </p>
            </div>

            {/* RATING */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Average Rating</p>

                  <p className="text-4xl font-black text-amber-400 mt-2">
                    {stats.averageRating || 0}
                  </p>
                </div>

                <Star size={30} className="text-amber-400" />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================
            QUICK NAVIGATION
        ====================================== */}

        <section className="mt-10">
          <div className="bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-cyan-500/5 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h3 className="text-lg font-bold">
                  Need to manage the platform?
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Quickly jump to the most frequently used admin modules.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 transition-all"
                >
                  <Users size={17} />
                  Users
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/jobs")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 transition-all"
                >
                  <Briefcase size={17} />
                  Jobs
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/applications")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 transition-all"
                >
                  <FileCheck2 size={17} />
                  Applications
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminAnalytics;

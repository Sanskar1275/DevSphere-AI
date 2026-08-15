import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import API from "../services/axios";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ProgressCards from "../components/dashboard/ProgressCards";
import ContinueLearning from "../components/dashboard/ContinueLearning";
import RecommendedCourses from "../components/dashboard/RecommendedCourses";
import ActivityPanel from "../components/dashboard/ActivityPanel";
import GoalsPanel from "../components/dashboard/GoalsPanel";
import LatestJobs from "../components/dashboard/LatestJobs";
import AIMentorCard from "../components/dashboard/AIMentorCard";

function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sidebar starts OPEN
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/dashboard");

        setDashboardData(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ==========================================
  // TOGGLE SIDEBAR
  // ==========================================

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  // ==========================================
  // CLOSE SIDEBAR
  // ==========================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mb-4" />

          <p className="text-slate-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-red-400 text-lg font-semibold">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-5
              px-5 py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-600
              text-white
              font-semibold
              transition
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SAFETY CHECK
  // ==========================================

  if (!dashboardData) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">No dashboard data available.</p>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-950 text-white">
      {/* ========================================
          SIDEBAR
      ======================================== */}

      <Sidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />

      {/* ========================================
          MAIN APPLICATION
      ======================================== */}

      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ease-in-out
          ${sidebarOpen ? "lg:pl-72" : "pl-0"}
        `}
      >
        {/* ======================================
            CONTROL BAR
        ====================================== */}

        <div
          className="
          sticky
          top-0
          z-30
          w-full
          flex
          items-center
          gap-3
          bg-slate-900
          border-b
          border-slate-800
          px-4
          sm:px-6
          py-3
        "
        >
          {/* ====================================
              SIDEBAR TOGGLE
          ==================================== */}

          <button
            type="button"
            onClick={toggleSidebar}
            className="
              w-10
              h-10
              rounded-xl
              bg-slate-800
              border
              border-slate-700
              flex
              items-center
              justify-center
              text-slate-300
              hover:bg-cyan-500
              hover:border-cyan-500
              hover:text-white
              transition-all
              duration-200
              shrink-0
            "
            title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <Menu size={22} />
          </button>

          {/* ====================================
              LOGO
          ==================================== */}

          <div className="text-lg font-bold text-white">
            DevSphere
            <span className="text-cyan-400"> AI</span>
          </div>
        </div>

        {/* ======================================
            TOPBAR
        ====================================== */}

        <Topbar
          user={dashboardData.user}
          onProfileClick={() => navigate("/profile")}
        />

        {/* ======================================
            MAIN CONTENT
        ====================================== */}

        <main
          className="
          w-full
          min-w-0
          p-4
          sm:p-6
          lg:p-8
        "
        >
          {/* ====================================
              LEARNING OVERVIEW
          ==================================== */}

          <ProgressCards stats={dashboardData.stats} />

          {/* ====================================
              CONTINUE LEARNING
          ==================================== */}

          <div className="mt-8">
            <ContinueLearning courses={dashboardData.continueLearning} />
          </div>

          {/* ====================================
              RECOMMENDED COURSES
          ==================================== */}

          <div className="mt-8">
            <RecommendedCourses courses={dashboardData.recommendedCourses} />
          </div>

          {/* ====================================
              LATEST JOBS
          ==================================== */}

          <div className="mt-8">
            <LatestJobs jobs={dashboardData.latestJobs} />
          </div>

          {/* ====================================
              AI MENTOR
          ==================================== */}

          <div className="mt-8">
            <AIMentorCard />
          </div>

          {/* ====================================
              ACTIVITY + GOALS
          ==================================== */}

          <div
            className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
            mt-8
          "
          >
            <ActivityPanel activities={dashboardData.recentActivity} />

            <GoalsPanel stats={dashboardData.stats} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

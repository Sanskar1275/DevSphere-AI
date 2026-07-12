import { useEffect, useState } from "react";

import API from "../services/axios";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ProgressCards from "../components/dashboard/ProgressCards";
import ContinueLearning from "../components/dashboard/ContinueLearning";
import RecommendedCourses from "../components/dashboard/RecommendedCourses";
import ActivityPanel from "../components/dashboard/ActivityPanel";
import GoalsPanel from "../components/dashboard/GoalsPanel";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");

        setDashboardData(res.data);
      } catch (err) {
        console.error(err);

        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex justify-center items-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-950 text-red-500 min-h-screen flex justify-center items-center text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar user={dashboardData.user} />

        <main className="p-8">
          <ProgressCards stats={dashboardData.stats} />

          <ContinueLearning />

          <RecommendedCourses />

          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <ActivityPanel />

            <GoalsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

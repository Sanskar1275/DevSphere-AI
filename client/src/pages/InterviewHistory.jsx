import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  History,
  Briefcase,
  CalendarDays,
  Trophy,
  Eye,
  RotateCcw,
  Loader2,
  Plus,
} from "lucide-react";

import { getInterviewHistory } from "../services/interviewService";

const InterviewHistory = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);

  // =========================================
  // FETCH INTERVIEW HISTORY
  // =========================================

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getInterviewHistory();

      setInterviews(res.interviews || []);
    } catch (error) {
      console.error("Failed to fetch interview history:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-cyan-400" size={50} />

          <h2 className="text-white text-2xl font-bold">
            Loading Interview History...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ======================================
          BACKGROUND GLOW
      ====================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          {/* Title */}

          <div className="flex items-center gap-4">
            <History className="text-cyan-400 shrink-0" size={42} />

            <div>
              <h1 className="text-5xl font-black">Interview History</h1>

              <p className="text-slate-400 mt-2">
                View all your previous AI mock interviews.
              </p>
            </div>
          </div>

          {/* Start New Interview */}

          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/10"
          >
            <Plus size={20} />
            Start New Interview
          </button>
        </div>

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {interviews.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center">
            <History size={70} className="mx-auto text-cyan-400 mb-6" />

            <h2 className="text-3xl font-bold">No Interviews Yet</h2>

            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              You haven't completed any AI interviews yet. Start your first mock
              interview to receive detailed performance analysis and improve
              your interview skills.
            </p>

            <button
              onClick={() => navigate("/jobs")}
              className="mt-8 flex items-center justify-center gap-2 mx-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition-all duration-300"
            >
              <Briefcase size={18} />
              Start Your First Interview
            </button>
          </div>
        ) : (
          /* ======================================
             INTERVIEW LIST
          ====================================== */

          <div className="grid gap-6">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* ==================================
                      LEFT SECTION
                  ================================== */}

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-cyan-400" size={28} />

                      <div>
                        <h2 className="text-2xl font-bold">
                          {interview.job?.title || "Unknown Job"}
                        </h2>

                        <p className="text-slate-400">
                          {interview.job?.company || "Unknown Company"}
                        </p>
                      </div>
                    </div>

                    {/* Interview Information */}

                    <div className="flex flex-wrap gap-6 mt-6">
                      {/* Date */}

                      <div className="flex items-center gap-4">
                        <CalendarDays size={18} className="text-slate-400" />

                        <span className="text-slate-300">
                          {new Date(interview.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      {/* Score */}

                      <div className="flex flex-wrap items-center gap-4">
                        <Trophy size={18} className="text-yellow-400" />

                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-5 py-3">
                          <p className="text-xs text-slate-400">
                            Overall Score
                          </p>

                          <h3 className="text-2xl font-bold text-cyan-400">
                            {interview.overallScore ?? 0}%
                          </h3>
                        </div>

                        {/* Status */}

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            interview.status === "Completed"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {interview.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ==================================
                      RIGHT SECTION
                  ================================== */}

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* View Report */}

                    <button
                      onClick={() =>
                        navigate(`/interview/result/${interview._id}`)
                      }
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition-all duration-300"
                    >
                      <Eye size={18} />
                      View Report
                    </button>

                    {/* Retake */}

                    <button
                      onClick={() =>
                        navigate(`/interview/setup/${interview.job?._id}`)
                      }
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950 transition-all duration-300"
                    >
                      <RotateCcw size={18} />
                      Retake
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;

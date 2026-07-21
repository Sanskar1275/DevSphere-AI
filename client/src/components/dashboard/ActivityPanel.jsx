import {
  Activity,
  BookOpen,
  CheckCircle2,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function ActivityPanel({ activities = [] }) {
  const navigate = useNavigate();

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    const activityDate = new Date(date);

    const now = new Date();

    const difference = now - activityDate;

    const minutes = Math.floor(difference / (1000 * 60));

    const hours = Math.floor(difference / (1000 * 60 * 60));

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    }

    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return activityDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex items-center gap-3 mb-6">
        <Activity size={24} className="text-cyan-400" />

        <div>
          <h2 className="text-2xl font-bold">Recent Activity</h2>

          <p className="text-sm text-slate-400 mt-1">
            Your latest learning activity.
          </p>
        </div>
      </div>

      {/* =========================================
          EMPTY STATE
      ========================================= */}

      {activities.length === 0 ? (
        <div className="border border-slate-800 bg-slate-950/40 rounded-xl p-8 text-center">
          <BookOpen size={38} className="text-slate-600 mx-auto" />

          <h3 className="font-semibold mt-4">No Recent Activity</h3>

          <p className="text-slate-400 text-sm mt-2">
            Start learning a course and your activity will appear here.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="mt-5 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition"
          >
            Explore Courses →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activityItem) => {
            const progress = activityItem.progress || 0;

            const completedLessons = activityItem.completedLessons || 0;

            const isCompleted = progress >= 100;

            return (
              <button
                key={activityItem.courseId}
                onClick={() =>
                  navigate(`/courses/${activityItem.courseId}/learn`)
                }
                className="w-full text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 rounded-xl p-4 transition group"
              >
                <div className="flex items-start gap-4">
                  {/* ICON */}

                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 size={20} className="text-green-400" />
                    ) : (
                      <BookOpen size={20} className="text-cyan-400" />
                    )}
                  </div>

                  {/* ACTIVITY DETAILS */}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition truncate">
                          {activityItem.title}
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                          {isCompleted
                            ? "Course completed"
                            : `${completedLessons} lessons completed`}
                        </p>
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-slate-600 group-hover:text-cyan-400 shrink-0 transition"
                      />
                    </div>

                    {/* PROGRESS */}

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500">Progress</span>

                        <span className="text-cyan-400 font-medium">
                          {progress}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* LAST ACCESSED */}

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                      <Clock3 size={13} />

                      {formatDate(activityItem.lastAccessedAt)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActivityPanel;

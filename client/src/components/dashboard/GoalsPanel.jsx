import {
  Target,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Trophy,
} from "lucide-react";

function GoalsPanel({ stats }) {
  const enrolledCourses = stats?.enrolledCourses || 0;

  const completedLessons = stats?.completedLessons || 0;

  const averageProgress = stats?.averageProgress || 0;

  const completedCourses = stats?.completedCourses || 0;

  // =========================================
  // DYNAMIC LEARNING GOALS
  // =========================================

  const goals = [
    {
      title: "Complete Your Courses",

      description:
        completedCourses > 0
          ? `${completedCourses} course${
              completedCourses > 1 ? "s" : ""
            } completed`
          : "Complete your first enrolled course",

      icon: <Trophy size={20} />,

      completed: completedCourses > 0,
    },

    {
      title: "Keep Learning",

      description:
        enrolledCourses > 0
          ? `${enrolledCourses} active course${
              enrolledCourses > 1 ? "s" : ""
            } in your learning journey`
          : "Enroll in your first course",

      icon: <BookOpen size={20} />,

      completed: enrolledCourses > 0,
    },

    {
      title: "Complete Lessons",

      description:
        completedLessons > 0
          ? `${completedLessons} lesson${
              completedLessons > 1 ? "s" : ""
            } completed so far`
          : "Complete your first lesson",

      icon: <CheckCircle2 size={20} />,

      completed: completedLessons > 0,
    },

    {
      title: "Reach 100% Progress",

      description:
        averageProgress >= 100
          ? "Excellent! You've reached 100% average progress"
          : `${averageProgress}% average learning progress`,

      icon: <TrendingUp size={20} />,

      completed: averageProgress >= 100,
    },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex items-center gap-3 mb-6">
        <Target size={24} className="text-cyan-400" />

        <div>
          <h2 className="text-2xl font-bold">Learning Goals</h2>

          <p className="text-slate-400 text-sm mt-1">
            Keep moving toward your learning milestones.
          </p>
        </div>
      </div>

      {/* =========================================
          OVERALL PROGRESS
      ========================================= */}

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Overall Learning Progress</p>

            <p className="text-3xl font-bold text-cyan-400 mt-2">
              {averageProgress}%
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <TrendingUp size={24} className="text-cyan-400" />
          </div>
        </div>

        <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden mt-5">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(averageProgress, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* =========================================
          GOALS
      ========================================= */}

      <div className="space-y-3">
        {goals.map((goal) => (
          <div
            key={goal.title}
            className="flex items-start gap-4 bg-slate-800/40 border border-slate-800 rounded-xl p-4"
          >
            {/* ICON */}

            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                goal.completed
                  ? "bg-green-500/10 text-green-400"
                  : "bg-cyan-500/10 text-cyan-400"
              }`}
            >
              {goal.icon}
            </div>

            {/* DETAILS */}

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{goal.title}</h3>

                {goal.completed && (
                  <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                )}
              </div>

              <p className="text-sm text-slate-400 mt-1">{goal.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalsPanel;

import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

function ProgressCards({ stats }) {
  const cards = [
    {
      title: "Enrolled Courses",
      value: stats?.enrolledCourses || 0,
      description: "Courses you are currently learning",
      icon: <BookOpen size={26} />,
    },
    {
      title: "Lessons Completed",
      value: stats?.completedLessons || 0,
      description: "Lessons completed across courses",
      icon: <CheckCircle2 size={26} />,
    },
    {
      title: "Average Progress",
      value: `${stats?.averageProgress || 0}%`,
      description: "Your overall learning progress",
      icon: <TrendingUp size={26} />,
    },
    {
      title: "Courses Completed",
      value: stats?.completedCourses || 0,
      description: "Courses completed successfully",
      icon: <GraduationCap size={26} />,
    },
  ];

  return (
    <div>
      {/* Section Header */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Learning Overview
        </h2>

        <p className="text-slate-400 mt-1">
          Track your learning progress and achievements.
        </p>
      </div>

      {/* Statistics Cards */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-slate-400 text-sm">
                  {card.title}
                </p>

                <p className="text-3xl font-bold text-white mt-3">
                  {card.value}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                {card.icon}
              </div>
            </div>

            <p className="text-slate-500 text-sm mt-5">
              {card.description}
            </p>

            {/* Progress indicator only for Average Progress */}

            {card.title === "Average Progress" && (
              <div className="mt-4">
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        stats?.averageProgress || 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressCards;
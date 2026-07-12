import { Clock, BookOpen, Star } from "lucide-react";

function CourseCard({ course }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-400 hover:scale-[1.02] transition-all duration-300 shadow-lg">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-white">
          {course.title}
        </h2>

        <span className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full">
          {course.level}
        </span>

      </div>

      <div className="flex items-center gap-1 text-yellow-400 mt-4">

        {[...Array(course.rating)].map((_, index) => (
          <Star
            key={index}
            size={18}
            fill="currentColor"
          />
        ))}

      </div>

      <div className="mt-5 space-y-2 text-slate-300">

        <div className="flex items-center gap-2">

          <BookOpen size={18} />

          {course.lessons} Lessons

        </div>

        <div className="flex items-center gap-2">

          <Clock size={18} />

          {course.duration}

        </div>

      </div>

      <div className="mt-6">

        <div className="flex justify-between mb-2">

          <span>Progress</span>

          <span>{course.progress}%</span>

        </div>

        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

          <div
            className="h-full bg-cyan-400"
            style={{
              width: `${course.progress}%`,
            }}
          />

        </div>

      </div>

      <button className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 rounded-xl py-3 font-semibold transition">
        {course.progress > 0
          ? "Continue Learning"
          : "Start Course"}
      </button>

    </div>
  );
}

export default CourseCard;
import { BookOpen, Clock, Star, ArrowRight, Sparkles } from "lucide-react";

import { useNavigate } from "react-router-dom";

function RecommendedCourses({ courses = [] }) {
  const navigate = useNavigate();

  // =========================================
  // NO RECOMMENDED COURSES
  // =========================================

  if (!courses || courses.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-5">
          <Sparkles size={24} className="text-cyan-400" />

          <h2 className="text-2xl font-bold">Recommended Courses</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <BookOpen size={40} className="text-slate-500 mx-auto" />

          <h3 className="text-lg font-semibold mt-4">No New Recommendations</h3>

          <p className="text-slate-400 mt-2">
            You've already explored the available courses.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="mt-5 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <Sparkles size={24} className="text-cyan-400" />

          <div>
            <h2 className="text-2xl font-bold">Recommended Courses</h2>

            <p className="text-slate-400 text-sm mt-1">
              Discover something new to learn.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/courses")}
          className="text-sm text-cyan-400 hover:text-cyan-300 transition"
        >
          View All
        </button>
      </div>

      {/* =========================================
          COURSE GRID
      ========================================= */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 transition"
          >
            {/* CATEGORY + LEVEL */}

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">
                {course.category || "Course"}
              </span>

              <span className="text-xs text-slate-400">
                {course.level || "Beginner"}
              </span>
            </div>

            {/* COURSE TITLE */}

            <h3 className="text-xl font-bold mt-5 line-clamp-2">
              {course.title}
            </h3>

            {/* DESCRIPTION */}

            {course.description && (
              <p className="text-slate-400 text-sm mt-3 line-clamp-2 leading-6">
                {course.description}
              </p>
            )}

            {/* COURSE INFORMATION */}

            <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                {course.lessons || 0} Lessons
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />

                {course.duration || "N/A"}
              </div>
            </div>

            {/* RATING */}

            <div className="flex items-center gap-2 mt-4">
              <Star size={17} fill="currentColor" className="text-yellow-400" />

              <span className="text-sm font-medium">{course.rating || 0}</span>

              <span className="text-xs text-slate-500">Course Rating</span>
            </div>

            {/* VIEW COURSE */}

            <button
              onClick={() => navigate(`/courses/${course._id}`)}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-semibold transition"
            >
              View Course
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedCourses;

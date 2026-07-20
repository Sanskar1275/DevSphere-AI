import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { getCourseById } from "../services/courseService";

function CourseLearn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCourseById(id);

        setCourse(data);
      } catch (error) {
        console.error(
          "Failed to load course:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Course not found.
      </div>
    );
  }

  const curriculum =
    course.curriculum || [];

  const currentLesson =
    curriculum[activeLesson];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center gap-4">

          <button
            onClick={() =>
              navigate(`/courses/${id}`)
            }
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-xl font-bold">
              {course.title}
            </h1>

            <p className="text-sm text-slate-400">
              Course Learning
            </p>
          </div>

        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex min-h-[calc(100vh-73px)]">

        {/* Curriculum Sidebar */}
        <aside className="w-80 shrink-0 border-r border-slate-800 bg-slate-900/50 p-5 hidden md:block">

          <div className="flex items-center gap-2 mb-6">
            <BookOpen
              size={20}
              className="text-cyan-400"
            />

            <h2 className="font-semibold">
              Course Curriculum
            </h2>
          </div>

          <div className="space-y-2">
            {curriculum.length > 0 ? (
              curriculum.map(
                (lesson, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setActiveLesson(index)
                    }
                    className={`w-full flex items-start gap-3 text-left p-3 rounded-xl transition ${
                      activeLesson === index
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {false ? (
                      <CheckCircle2
                        size={18}
                        className="text-green-400 shrink-0 mt-0.5"
                      />
                    ) : (
                      <Circle
                        size={18}
                        className="shrink-0 mt-0.5"
                      />
                    )}

                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 mb-1">
                        Lesson {index + 1}
                      </p>

                      <p className="text-sm">
                        {lesson}
                      </p>
                    </div>
                  </button>
                )
              )
            ) : (
              <p className="text-sm text-slate-500">
                No lessons available yet.
              </p>
            )}
          </div>

        </aside>

        {/* Main Lesson Area */}
        <main className="flex-1 p-6 md:p-10">

          {currentLesson ? (
            <div className="max-w-4xl mx-auto">

              <p className="text-cyan-400 text-sm font-medium mb-2">
                Lesson {activeLesson + 1}
              </p>

              <h2 className="text-3xl font-bold mb-6">
                {currentLesson}
              </h2>

              {/* Lesson Content Placeholder */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[350px]">

                <h3 className="text-xl font-semibold mb-4">
                  Lesson Content
                </h3>

                <p className="text-slate-400 leading-7">
                  The learning content for{" "}
                  <span className="text-white">
                    {currentLesson}
                  </span>{" "}
                  will appear here.
                </p>

                <p className="text-slate-500 mt-4 leading-7">
                  In the next steps, we'll connect
                  lesson completion and real
                  progress tracking to your
                  enrollment system.
                </p>

              </div>

              {/* Lesson Actions */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">

                <button
                  disabled={
                    activeLesson === 0
                  }
                  onClick={() =>
                    setActiveLesson(
                      (prev) => prev - 1
                    )
                  }
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition"
                >
                  ← Previous Lesson
                </button>

                <button
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition"
                >
                  Mark as Complete
                </button>

                <button
                  disabled={
                    activeLesson ===
                    curriculum.length - 1
                  }
                  onClick={() =>
                    setActiveLesson(
                      (prev) => prev + 1
                    )
                  }
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition"
                >
                  Next Lesson →
                </button>

              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              No course curriculum is available.
            </div>
          )}

        </main>

      </div>
    </div>
  );
}

export default CourseLearn;
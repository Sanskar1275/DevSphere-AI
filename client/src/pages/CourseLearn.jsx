import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";

import { getCourseById } from "../services/courseService";

import {
  checkEnrollment,
  completeLesson,
} from "../services/enrollmentService";

import { useAuth } from "../hooks/useAuth";

function CourseLearn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] =
    useState(null);

  const [enrollment, setEnrollment] =
    useState(null);

  const [activeLesson, setActiveLesson] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [completing, setCompleting] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================
  // LOAD COURSE + ENROLLMENT
  // =========================================

  useEffect(() => {
    const loadCourse = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Get course
        const courseData =
          await getCourseById(id);

        setCourse(courseData);

        // Get enrollment
        const enrollmentData =
          await checkEnrollment(
            user.id,
            id
          );

        // User must be enrolled
        if (!enrollmentData.enrolled) {
          navigate(
            `/courses/${id}`,
            {
              replace: true,
            }
          );

          return;
        }

        setEnrollment(
          enrollmentData.enrollment
        );
      } catch (error) {
        console.error(
          "Failed to load course:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, user?.id, navigate]);

  // =========================================
  // COURSE DATA
  // =========================================

  const curriculum =
    course?.curriculum || [];

  const currentLesson =
    curriculum[activeLesson];

  const completedLessons =
    enrollment?.completedLessons || [];

  const isCurrentLessonCompleted =
    completedLessons.includes(
      activeLesson
    );

  const progress =
    enrollment?.progress || 0;

  // =========================================
  // MARK LESSON COMPLETE
  // =========================================

  const handleMarkComplete =
    async () => {
      if (
        !user?.id ||
        !course ||
        completing ||
        isCurrentLessonCompleted
      ) {
        return;
      }

      try {
        setCompleting(true);
        setError("");

        const data =
          await completeLesson(
            user.id,
            id,
            activeLesson
          );

        // Update enrollment immediately
        setEnrollment(
          data.enrollment
        );

        // Automatically move to next lesson
        if (
          activeLesson <
          curriculum.length - 1
        ) {
          setActiveLesson(
            (prev) => prev + 1
          );
        }
      } catch (error) {
        console.error(
          "Failed to complete lesson:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to complete lesson."
        );
      } finally {
        setCompleting(false);
      }
    };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2
            size={24}
            className="animate-spin text-cyan-400"
          />

          Loading Course...
        </div>
      </div>
    );
  }

  // =========================================
  // COURSE NOT FOUND
  // =========================================

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">
          Course not found.
        </p>

        {error && (
          <p className="text-red-400">
            {error}
          </p>
        )}

        <button
          onClick={() =>
            navigate("/courses")
          }
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">

        <div className="max-w-[1600px] mx-auto flex items-center gap-4">

          <button
            onClick={() =>
              navigate(
                `/courses/${id}`
              )
            }
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="flex-1">

            <h1 className="text-xl font-bold">
              {course.title}
            </h1>

            <p className="text-sm text-slate-400">
              Course Learning
            </p>

          </div>

          {/* HEADER PROGRESS */}

          <div className="hidden sm:block text-right">

            <p className="text-sm text-slate-400">
              Progress
            </p>

            <p className="text-cyan-400 font-semibold">
              {progress}%
            </p>

          </div>

        </div>

      </header>

      <div className="max-w-[1600px] mx-auto flex min-h-[calc(100vh-73px)]">

        {/* CURRICULUM SIDEBAR */}

        <aside className="w-80 shrink-0 border-r border-slate-800 bg-slate-900/50 p-5 hidden md:block">

          <div className="flex items-center gap-2 mb-4">

            <BookOpen
              size={20}
              className="text-cyan-400"
            />

            <h2 className="font-semibold">
              Course Curriculum
            </h2>

          </div>

          {/* PROGRESS BAR */}

          <div className="mb-6">

            <div className="flex justify-between text-xs mb-2">

              <span className="text-slate-400">
                Your Progress
              </span>

              <span className="text-cyan-400 font-semibold">
                {progress}%
              </span>

            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="text-xs text-slate-500 mt-2">
              {
                completedLessons.length
              }{" "}
              of {curriculum.length} lessons
              completed
            </p>

          </div>

          {/* LESSON LIST */}

          <div className="space-y-2">

            {curriculum.length > 0 ? (
              curriculum.map(
                (lesson, index) => {
                  const isCompleted =
                    completedLessons.includes(
                      index
                    );

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        setActiveLesson(
                          index
                        )
                      }
                      className={`w-full flex items-start gap-3 text-left p-3 rounded-xl transition ${
                        activeLesson ===
                        index
                          ? "bg-cyan-500/10 border border-cyan-500/30 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >

                      {isCompleted ? (
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
                          Lesson{" "}
                          {index + 1}
                        </p>

                        <p className="text-sm">
                          {lesson}
                        </p>

                      </div>

                    </button>
                  );
                }
              )
            ) : (
              <p className="text-sm text-slate-500">
                No lessons available yet.
              </p>
            )}

          </div>

        </aside>

        {/* MAIN LESSON AREA */}

        <main className="flex-1 p-6 md:p-10">

          {error && (
            <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {currentLesson ? (
            <div className="max-w-4xl mx-auto">

              {/* LESSON NUMBER */}

              <p className="text-cyan-400 text-sm font-medium mb-2">
                Lesson{" "}
                {activeLesson + 1} of{" "}
                {curriculum.length}
              </p>

              {/* LESSON TITLE */}

              <div className="flex items-start gap-3 mb-6">

                <h2 className="text-3xl font-bold">
                  {currentLesson}
                </h2>

                {isCurrentLessonCompleted && (
                  <CheckCircle2
                    size={26}
                    className="text-green-400 shrink-0 mt-1"
                  />
                )}

              </div>

              {/* LESSON CONTENT */}

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

              </div>

              {/* LESSON ACTIONS */}

              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">

                {/* PREVIOUS */}

                <button
                  disabled={
                    activeLesson === 0
                  }
                  onClick={() =>
                    setActiveLesson(
                      (prev) =>
                        prev - 1
                    )
                  }
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition"
                >
                  ← Previous Lesson
                </button>

                {/* COMPLETE */}

                <button
                  onClick={
                    handleMarkComplete
                  }
                  disabled={
                    completing ||
                    isCurrentLessonCompleted
                  }
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                    isCurrentLessonCompleted
                      ? "bg-green-500/20 text-green-400 cursor-default"
                      : "bg-cyan-500 hover:bg-cyan-600"
                  } disabled:opacity-70`}
                >

                  {completing ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : isCurrentLessonCompleted ? (
                    <>
                      <CheckCircle2
                        size={18}
                      />

                      Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={18}
                      />

                      Mark as Complete
                    </>
                  )}

                </button>

                {/* NEXT */}

                <button
                  disabled={
                    activeLesson ===
                    curriculum.length - 1
                  }
                  onClick={() =>
                    setActiveLesson(
                      (prev) =>
                        prev + 1
                    )
                  }
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition"
                >
                  Next Lesson →
                </button>

              </div>

              {/* COURSE COMPLETE MESSAGE */}

              {progress === 100 && (
                <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">

                  <CheckCircle2
                    size={40}
                    className="text-green-400 mx-auto mb-3"
                  />

                  <h3 className="text-xl font-bold text-green-400">
                    Course Completed! 🎉
                  </h3>

                  <p className="text-slate-400 mt-2">
                    You have completed all
                    lessons in this course.
                  </p>

                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              No course curriculum is
              available.
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default CourseLearn;
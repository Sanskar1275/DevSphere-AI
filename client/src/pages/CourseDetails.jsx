import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  BookOpen,
  Clock,
  Star,
  Users,
  Play,
  Loader2,
} from "lucide-react";

import { getCourseById } from "../services/courseService";

import {
  enrollInCourse,
  checkEnrollment,
} from "../services/enrollmentService";

import { useAuth } from "../hooks/useAuth";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const [error, setError] = useState("");

  // =========================================
  // LOAD COURSE AND ENROLLMENT STATUS
  // =========================================

  useEffect(() => {
    const loadCourseDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch course details
        const courseData = await getCourseById(id);

        setCourse(courseData);

        // Check enrollment status
        if (user?.id) {
          const enrollmentData =
            await checkEnrollment(
              user.id,
              id
            );

          setIsEnrolled(
            enrollmentData.enrolled
          );

          setEnrollment(
            enrollmentData.enrollment
          );
        } else {
          setIsEnrolled(false);
          setEnrollment(null);
        }
      } catch (error) {
        console.error(
          "Failed to load course details:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load course details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourseDetails();
    }
  }, [id, user?.id]);

  // =========================================
  // ENROLL IN COURSE
  // =========================================

  const handleEnroll = async () => {
    if (!user?.id) {
      setError(
        "Please log in to start this course."
      );

      return;
    }

    if (enrolling) return;

    try {
      setEnrolling(true);
      setError("");

      const data = await enrollInCourse(
        user.id,
        id
      );

      setEnrollment(data.enrollment);
      setIsEnrolled(true);
    } catch (error) {
      console.error(
        "Failed to enroll in course:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to enroll in course."
      );
    } finally {
      setEnrolling(false);
    }
  };

  // =========================================
  // CONTINUE LEARNING
  // =========================================

  const handleContinueLearning = () => {
    navigate(`/courses/${id}/learn`);
  };

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2
            size={24}
            className="animate-spin text-cyan-400"
          />

          <span>Loading Course...</span>
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

        <button
          onClick={() => navigate("/courses")}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* COURSE TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold">
          {course.title}
        </h1>

        {/* RATING */}
        <div className="flex items-center gap-2 mt-5">
          <div className="flex gap-1">
            {[
              ...Array(
                Math.round(
                  course.rating || 0
                )
              ),
            ].map((_, index) => (
              <Star
                key={index}
                size={20}
                fill="currentColor"
                className="text-yellow-400"
              />
            ))}
          </div>

          <span className="text-slate-400 text-sm">
            {course.rating || 0}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-300 mt-6 text-lg leading-relaxed">
          {course.description}
        </p>

        {/* COURSE INFORMATION */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          {/* DURATION */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <Clock className="text-cyan-400 mb-3" />

            <h3 className="text-sm text-slate-400">
              Duration
            </h3>

            <p className="text-lg font-semibold mt-1">
              {course.duration}
            </p>
          </div>

          {/* LESSONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <BookOpen className="text-cyan-400 mb-3" />

            <h3 className="text-sm text-slate-400">
              Lessons
            </h3>

            <p className="text-lg font-semibold mt-1">
              {course.lessons}
            </p>
          </div>

          {/* STUDENTS */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <Users className="text-cyan-400 mb-3" />

            <h3 className="text-sm text-slate-400">
              Students
            </h3>

            <p className="text-lg font-semibold mt-1">
              {course.enrolledStudents || 0}
            </p>
          </div>

        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* COURSE ACTION */}
        <div className="mt-10">
          {isEnrolled ? (
            <button
              onClick={
                handleContinueLearning
              }
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl font-semibold transition"
            >
              <Play size={19} />

              Continue Learning
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold transition"
            >
              {enrolling ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Enrolling...
                </>
              ) : (
                <>
                  <Play size={19} />

                  Start Course
                </>
              )}
            </button>
          )}
        </div>

        {/* ENROLLMENT PROGRESS */}
        {isEnrolled && enrollment && (
          <div className="mt-8 max-w-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">
                Your Progress
              </span>

              <span className="text-sm font-semibold text-cyan-400">
                {enrollment.progress || 0}%
              </span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{
                  width: `${
                    enrollment.progress || 0
                  }%`,
                }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CourseDetails;
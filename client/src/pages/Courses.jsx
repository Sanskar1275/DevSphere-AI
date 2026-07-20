import { useEffect, useState } from "react";

import { getCourses } from "../services/courseService";
import { getUserEnrollments } from "../services/enrollmentService";

import { useAuth } from "../hooks/useAuth";

import SearchBar from "../components/courses/SearchBar";
import CategoryFilter from "../components/courses/CategoryFilter";
import CourseGrid from "../components/courses/CourseGrid";

function Courses() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All");

  // =========================================
  // LOAD COURSES + USER ENROLLMENTS
  // =========================================

  useEffect(() => {
    const fetchCoursesAndEnrollments =
      async () => {
        try {
          setLoading(true);

          // Get all courses
          const coursesData =
            await getCourses();

          // If user is not available yet,
          // show courses without enrollment data
          if (!user?.id) {
            setCourses(
              coursesData.map((course) => ({
                ...course,
                progress: 0,
                isEnrolled: false,
              }))
            );

            return;
          }

          // Get logged-in user's enrollments
          const enrollmentData =
            await getUserEnrollments(
              user.id
            );

          const enrollments =
            enrollmentData.enrollments ||
            [];

          // Merge enrollment progress
          // with corresponding course
          const coursesWithProgress =
            coursesData.map((course) => {
              const enrollment =
                enrollments.find(
                  (item) =>
                    item.course ===
                    course._id
                );

              return {
                ...course,

                // User-specific progress
                progress:
                  enrollment?.progress ||
                  0,

                // Whether user enrolled
                isEnrolled:
                  Boolean(enrollment),

                // Optional enrollment data
                enrollment:
                  enrollment || null,
              };
            });

          setCourses(
            coursesWithProgress
          );
        } catch (error) {
          console.error(
            "Failed to load courses:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCoursesAndEnrollments();
  }, [user?.id]);

  // =========================================
  // FILTER COURSES
  // =========================================

  const filteredCourses =
    courses.filter((course) => {
      const matchesSearch =
        course.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === "All" ||
        course.category ===
          category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex justify-center items-center">
        Loading Courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      {/* PAGE TITLE */}

      <h1 className="text-4xl md:text-5xl font-bold mb-10">
        📚 Courses
      </h1>

      {/* SEARCH + CATEGORY FILTER */}

      <div className="flex flex-col lg:flex-row justify-between gap-6">

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <CategoryFilter
          category={category}
          setCategory={setCategory}
        />

      </div>

      {/* COURSE GRID */}

      <CourseGrid
        courses={filteredCourses}
      />

      {/* NO RESULTS */}

      {filteredCourses.length === 0 && (
        <div className="mt-16 text-center">

          <p className="text-slate-400 text-lg">
            No courses found.
          </p>

        </div>
      )}

    </div>
  );
}

export default Courses;
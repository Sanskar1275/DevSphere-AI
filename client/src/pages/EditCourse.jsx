import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Plus,
  Trash2,
  BookOpen,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { getCourseById } from "../services/courseService";
import { updateCourse } from "../services/adminService";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    duration: "",
  });

  const [curriculum, setCurriculum] =
    useState([]);

  const [lessonTitle, setLessonTitle] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================
  // LOAD EXISTING COURSE
  // =========================================

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const course =
          await getCourseById(id);

        setFormData({
          title: course.title || "",
          description:
            course.description || "",
          category:
            course.category || "",
          level:
            course.level || "Beginner",
          duration:
            course.duration || "",
        });

        setCurriculum(
          Array.isArray(course.curriculum)
            ? course.curriculum
            : []
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

    if (id) {
      fetchCourse();
    }
  }, [id]);

  // =========================================
  // HANDLE FORM INPUT
  // =========================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // =========================================
  // ADD LESSON
  // =========================================

  const handleAddLesson = () => {
    const trimmedTitle =
      lessonTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    setCurriculum((prev) => [
      ...prev,
      trimmedTitle,
    ]);

    setLessonTitle("");
  };

  // =========================================
  // REMOVE LESSON
  // =========================================

  const handleRemoveLesson = (
    index
  ) => {
    setCurriculum((prev) =>
      prev.filter(
        (_, lessonIndex) =>
          lessonIndex !== index
      )
    );
  };

  // =========================================
  // ADD LESSON WITH ENTER
  // =========================================

  const handleLessonKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleAddLesson();
    }
  };

  // =========================================
  // UPDATE COURSE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category.trim()
    ) {
      alert(
        "Please fill in all required course details."
      );

      return;
    }

    if (curriculum.length === 0) {
      alert(
        "Please add at least one lesson to the curriculum."
      );

      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await updateCourse(id, {
        ...formData,

        // Keep lesson count synced
        // with curriculum
        lessons: curriculum.length,

        curriculum,
      });

      alert(
        "✅ Course Updated Successfully!"
      );

      navigate(
        "/admin/courses"
      );
    } catch (error) {
      console.error(
        "Failed to update course:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update course."
      );

      alert(
        error.response?.data?.message ||
          "❌ Failed to Update Course"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2
            size={24}
            className="animate-spin text-cyan-400"
          />

          <span className="text-slate-300">
            Loading Course...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/courses"
            )
          }
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />

          Back to Courses
        </button>

        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800">

          {/* HEADER */}

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">
              ✏️ Edit Course
            </h1>

            <p className="text-slate-400 mt-2">
              Update course details and
              manage its curriculum.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* TITLE */}

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Course Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Course Title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Course Description
              </label>

              <textarea
                name="description"
                placeholder="Course Description"
                rows="4"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* CATEGORY + LEVEL */}

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Level
                </label>

                <select
                  name="level"
                  value={
                    formData.level
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
                >
                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>
                </select>
              </div>

            </div>

            {/* DURATION */}

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Course Duration
              </label>

              <input
                type="text"
                name="duration"
                placeholder="e.g. 15 Hours"
                value={
                  formData.duration
                }
                onChange={
                  handleChange
                }
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            {/* CURRICULUM */}

            <div className="border-t border-slate-800 pt-6">

              <div className="flex items-center gap-2 mb-4">
                <BookOpen
                  size={22}
                  className="text-cyan-400"
                />

                <h2 className="text-xl font-semibold">
                  Course Curriculum
                </h2>

                <span className="ml-auto text-sm text-slate-400">
                  {
                    curriculum.length
                  }{" "}
                  {curriculum.length ===
                  1
                    ? "Lesson"
                    : "Lessons"}
                </span>
              </div>

              {/* ADD LESSON */}

              <div className="flex flex-col sm:flex-row gap-3">

                <input
                  type="text"
                  placeholder="Enter lesson title..."
                  value={
                    lessonTitle
                  }
                  onChange={(e) =>
                    setLessonTitle(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleLessonKeyDown
                  }
                  className="flex-1 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
                />

                <button
                  type="button"
                  onClick={
                    handleAddLesson
                  }
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl font-medium transition"
                >
                  <Plus size={18} />

                  Add Lesson
                </button>

              </div>

              {/* CURRICULUM LIST */}

              {curriculum.length >
              0 ? (
                <div className="mt-5 space-y-3">

                  {curriculum.map(
                    (
                      lesson,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-slate-800 border border-slate-700 p-4 rounded-xl"
                      >
                        <div className="w-8 h-8 shrink-0 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center text-sm font-semibold">
                          {index +
                            1}
                        </div>

                        <p className="flex-1 text-slate-200">
                          {lesson}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveLesson(
                              index
                            )
                          }
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                          title="Remove lesson"
                        >
                          <Trash2
                            size={
                              17
                            }
                          />
                        </button>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="mt-5 border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500">
                  No lessons added
                  yet.
                </div>
              )}

            </div>

            {/* UPDATE BUTTON */}

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition"
            >
              {isSubmitting
                ? "Updating Course..."
                : "Update Course"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default EditCourse;
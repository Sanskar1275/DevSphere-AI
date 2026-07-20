import { useState } from "react";
import {
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";

import { createCourse } from "../../services/adminService";

function AddCourseForm() {
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

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =========================================
  // HANDLE FORM INPUT
  // =========================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

  const handleRemoveLesson = (index) => {
    setCurriculum((prev) =>
      prev.filter(
        (_, lessonIndex) =>
          lessonIndex !== index
      )
    );
  };

  // =========================================
  // ADD LESSON WITH ENTER KEY
  // =========================================

  const handleLessonKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleAddLesson();
    }
  };

  // =========================================
  // CREATE COURSE
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

      await createCourse({
        ...formData,

        // Number of lessons automatically
        // matches the curriculum
        lessons: curriculum.length,

        rating: 5,
        progress: 0,
        thumbnail: "",
        instructor: "Sanskar Sonawane",
        enrolledStudents: 0,

        requirements: [],
        skills: [],

        // Save actual lessons
        curriculum,
      });

      alert(
        "✅ Course Created Successfully!"
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        level: "",
        duration: "",
      });

      setCurriculum([]);
      setLessonTitle("");
    } catch (error) {
      console.error(
        "Failed to create course:",
        error
      );

      console.error(
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "❌ Failed to Create Course"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6"
    >
      {/* HEADER */}

      <div>
        <h2 className="text-3xl font-bold text-cyan-400">
          Add New Course
        </h2>

        <p className="text-slate-400 mt-2">
          Create a new course and add its
          curriculum.
        </p>
      </div>

      {/* COURSE TITLE */}

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Course Title
        </label>

        <input
          type="text"
          name="title"
          placeholder="e.g. React.js Bootcamp"
          value={formData.title}
          onChange={handleChange}
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
          placeholder="Describe the course..."
          rows="4"
          value={formData.description}
          onChange={handleChange}
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
            placeholder="e.g. Web Development"
            value={formData.category}
            onChange={handleChange}
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
            value={formData.level}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
          >
            <option value="">
              Select Level
            </option>

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
          value={formData.duration}
          onChange={handleChange}
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

          <h3 className="text-xl font-semibold">
            Course Curriculum
          </h3>

          <span className="ml-auto text-sm text-slate-400">
            {curriculum.length}{" "}
            {curriculum.length === 1
              ? "Lesson"
              : "Lessons"}
          </span>
        </div>

        {/* ADD LESSON */}

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            type="text"
            placeholder="Enter lesson title..."
            value={lessonTitle}
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
            onClick={handleAddLesson}
            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl font-medium transition"
          >
            <Plus size={18} />

            Add Lesson
          </button>

        </div>

        {/* LESSON LIST */}

        {curriculum.length > 0 && (
          <div className="mt-5 space-y-3">

            {curriculum.map(
              (lesson, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-800 border border-slate-700 p-4 rounded-xl"
                >
                  <div className="w-8 h-8 shrink-0 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center text-sm font-semibold">
                    {index + 1}
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
                    <Trash2 size={17} />
                  </button>
                </div>
              )
            )}

          </div>
        )}

        {curriculum.length === 0 && (
          <div className="mt-5 border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500">
            No lessons added yet.
          </div>
        )}

      </div>

      {/* CREATE COURSE */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition"
      >
        {isSubmitting
          ? "Creating Course..."
          : "Create Course"}
      </button>

    </form>
  );
}

export default AddCourseForm;
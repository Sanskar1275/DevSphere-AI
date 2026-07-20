import { useState } from "react";
import { createCourse } from "../../services/adminService";

function AddCourseForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    lessons: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCourse({
        ...formData,
        lessons: Number(formData.lessons),
        rating: 5,
        progress: 0,
        thumbnail: "",
        instructor: "Sanskar Sonawane",
        enrolledStudents: 0,
        requirements: [],
        skills: [],
        curriculum: [],
      });

      alert("✅ Course Created Successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        level: "",
        lessons: "",
        duration: "",
      });
    } catch (error) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);

      alert("❌ Failed to Create Course");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-5"
    >
      <h2 className="text-3xl font-bold text-cyan-400">Add New Course</h2>

      <input
        type="text"
        name="title"
        placeholder="Course Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
      />

      <textarea
        name="description"
        placeholder="Course Description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
      />

      <input
        type="text"
        name="level"
        placeholder="Level"
        value={formData.level}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
      />

      <input
        type="number"
        name="lessons"
        placeholder="Lessons"
        value={formData.lessons}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
      />

      <input
        type="text"
        name="duration"
        placeholder="Duration"
        value={formData.duration}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
      />

      <button className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-bold">
        Create Course
      </button>
    </form>
  );
}

export default AddCourseForm;

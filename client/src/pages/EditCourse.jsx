import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    lessons: "",
    duration: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await getCourseById(id);

        setFormData({
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level,
          lessons: course.lessons,
          duration: course.duration,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCourse(id, {
        ...formData,
        lessons: Number(formData.lessons),
      });

      alert("✅ Course Updated Successfully!");

      navigate("/admin/courses");
    } catch (error) {
      console.log(error);
      alert("❌ Failed to Update Course");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-8 border border-slate-800">

        <h1 className="text-4xl font-bold text-cyan-400 mb-8">
          ✏️ Edit Course
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <input
            type="text"
            name="level"
            placeholder="Level"
            value={formData.level}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <input
            type="number"
            name="lessons"
            placeholder="Lessons"
            value={formData.lessons}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-bold"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
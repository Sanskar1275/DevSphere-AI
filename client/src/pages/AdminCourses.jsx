import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import { deleteCourse } from "../services/adminService";
import { useNavigate } from "react-router-dom";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id),
      );

      alert("✅ Course deleted successfully!");
    } catch (error) {
      console.log(error);
      alert("❌ Failed to delete course");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        📚 Manage Courses
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Level</th>
              <th className="p-4 text-left">Lessons</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr
                key={course._id}
                className="border-t border-slate-800 hover:bg-slate-900"
              >
                <td className="p-4">{course.title}</td>
                <td className="p-4">{course.category}</td>
                <td className="p-4">{course.level}</td>
                <td className="p-4">{course.lessons}</td>

                <td className="p-4 space-x-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/courses/edit/${course._id}`)
                    }
                    className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCourses;

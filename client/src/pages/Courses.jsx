import { useEffect, useState } from "react";

import { getCourses } from "../services/courseService";

import SearchBar from "../components/courses/SearchBar";
import CategoryFilter from "../components/courses/CategoryFilter";
import CourseGrid from "../components/courses/CourseGrid";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || course.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex justify-center items-center">
        Loading Courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        📚 Courses
      </h1>

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

      <CourseGrid
        courses={filteredCourses}
      />

    </div>
  );
}

export default Courses;
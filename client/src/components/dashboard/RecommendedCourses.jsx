function RecommendedCourses() {

  const courses = [
    "React",
    "Node.js",
    "MongoDB"
  ];

  return (
    <div className="mt-8">

      <h2 className="text-2xl font-bold mb-5">
        ⭐ Recommended Courses
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {courses.map((course) => (

          <div
            key={course}
            className="bg-slate-900 p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold">
              {course}
            </h3>

            <button className="mt-5 bg-cyan-500 px-5 py-2 rounded-lg">
              Start
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecommendedCourses;
import CourseCard from "./CourseCard";

function CourseGrid({ courses }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
        />
      ))}

    </div>
  );
}

export default CourseGrid;
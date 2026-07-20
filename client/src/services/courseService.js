import API from "./axios";

export const getCourses = async () => {
  const res = await API.get("/courses");

  console.log("COURSES API RESPONSE:", res.data);

  return res.data.courses;
};

export const getCourseById = async (id) => {
  const res = await API.get(`/courses/${id}`);

  return res.data.course;
};
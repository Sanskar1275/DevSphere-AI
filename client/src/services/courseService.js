import API from "./axios";

export const getCourses = async () => {
  const res = await API.get("/courses");
  return res.data.courses;
};
import API from "./axios";

export const createCourse = async (courseData) => {
  const res = await API.post("/courses", courseData);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await API.delete(`/courses/${id}`);
  return res.data;
};

export const updateCourse = async (id, courseData) => {
  const res = await API.put(`/courses/${id}`, courseData);
  return res.data;
};
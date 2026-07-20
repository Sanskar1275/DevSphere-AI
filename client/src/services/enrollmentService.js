import API from "./axios";

// Enroll user in a course
export const enrollInCourse = async (
  userId,
  courseId
) => {
  const res = await API.post(
    "/enrollments",
    {
      userId,
      courseId,
    }
  );

  return res.data;
};

// Check whether user is enrolled
export const checkEnrollment = async (
  userId,
  courseId
) => {
  const res = await API.get(
    `/enrollments/check/${userId}/${courseId}`
  );

  return res.data;
};
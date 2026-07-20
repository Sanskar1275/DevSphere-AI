import API from "./axios";

// ENROLL USER IN A COURSE
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

// CHECK IF USER IS ENROLLED IN A COURSE
export const checkEnrollment = async (
  userId,
  courseId
) => {
  const res = await API.get(
    `/enrollments/check/${userId}/${courseId}`
  );

  return res.data;
};
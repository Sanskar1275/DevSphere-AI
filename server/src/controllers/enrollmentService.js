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

// Check if user is enrolled
export const checkEnrollment = async (
  userId,
  courseId
) => {
  const res = await API.get(
    `/enrollments/check/${userId}/${courseId}`
  );

  return res.data;
};

// Mark lesson as complete
export const completeLesson = async (
  userId,
  courseId,
  lessonIndex
) => {
  const res = await API.patch(
    "/enrollments/complete-lesson",
    {
      userId,
      courseId,
      lessonIndex,
    }
  );

  return res.data;
};

// Get all enrollments for logged-in user
export const getUserEnrollments = async (
  userId
) => {
  const res = await API.get(
    `/enrollments/user/${userId}`
  );

  return res.data;
};
import API from "./axios";

// =========================================
// ENROLL USER IN COURSE
// =========================================

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

// =========================================
// CHECK USER ENROLLMENT
// =========================================

export const checkEnrollment = async (
  userId,
  courseId
) => {
  const res = await API.get(
    `/enrollments/check/${userId}/${courseId}`
  );

  return res.data;
};

// =========================================
// MARK LESSON AS COMPLETE
// =========================================

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

// =========================================
// GET ALL ENROLLMENTS OF A USER
// =========================================

export const getUserEnrollments = async (
  userId
) => {
  const res = await API.get(
    `/enrollments/user/${userId}`
  );

  return res.data;
};
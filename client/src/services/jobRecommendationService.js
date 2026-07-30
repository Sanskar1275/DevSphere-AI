import API from "./axios";

// ==========================================
// GET PERSONALIZED JOB RECOMMENDATIONS
// ==========================================

export const getRecommendedJobs = async () => {
  const response = await API.get("/job-recommendations");

  return response.data;
};

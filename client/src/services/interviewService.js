import API from "./axios";

// ==========================================
// START INTERVIEW
// ==========================================

export const startInterview = async (jobId) => {
  const response = await API.post(`/interviews/start/${jobId}`);

  return response.data;
};

// ==========================================
// GET INTERVIEW
// ==========================================

export const getInterview = async (interviewId) => {
  const response = await API.get(`/interviews/${interviewId}`);

  return response.data;
};

// ==========================================
// SUBMIT INTERVIEW
// ==========================================

export const submitInterview = async (interviewId, answers) => {
  const response = await API.post(`/interviews/submit/${interviewId}`, {
    answers,
  });

  return response.data;
};

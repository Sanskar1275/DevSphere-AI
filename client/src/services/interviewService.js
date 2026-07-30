import API from "./axios";

// Start Interview
export const startInterview = async (jobId) => {
  const res = await API.post(`/interviews/start/${jobId}`);
  return res.data;
};

// Get Interview
export const getInterview = async (interviewId) => {
  const res = await API.get(`/interviews/${interviewId}`);
  return res.data;
};
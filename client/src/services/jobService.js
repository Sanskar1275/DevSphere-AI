import API from "./axios";

// =========================================
// GET ALL JOBS
// =========================================

export const getJobs = async () => {
  const res = await API.get("/jobs");

  return res.data.jobs;
};

// =========================================
// GET SINGLE JOB BY ID
// =========================================

export const getJobById = async (id) => {
  const res = await API.get(`/jobs/${id}`);

  return res.data.job;
};

// =========================================
// CREATE NEW JOB
// =========================================

export const createJob = async (jobData) => {
  const res = await API.post("/jobs", jobData);

  return res.data;
};

// =========================================
// UPDATE JOB
// =========================================

export const updateJob = async (id, jobData) => {
  const res = await API.put(`/jobs/${id}`, jobData);

  return res.data;
};

// =========================================
// DELETE JOB
// =========================================

export const deleteJob = async (id) => {
  const res = await API.delete(`/jobs/${id}`);

  return res.data;
};

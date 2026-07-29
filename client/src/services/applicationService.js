import API from "./axios";

// ==========================================
// APPLY FOR JOB
// ==========================================

export const applyForJob = async (jobId, coverLetter = "") => {
  const response = await API.post("/applications", {
    jobId,
    coverLetter,
  });

  return response.data;
};

// ==========================================
// GET MY APPLICATIONS
// ==========================================

export const getMyApplications = async () => {
  const response = await API.get("/applications/my");

  return response.data;
};

// ==========================================
// GET SINGLE APPLICATION
// ==========================================

export const getApplicationById = async (applicationId) => {
  const response = await API.get(`/applications/${applicationId}`);

  return response.data;
};

// ==========================================
// WITHDRAW APPLICATION
// ==========================================

export const withdrawApplication = async (applicationId) => {
  const response = await API.patch(`/applications/${applicationId}/withdraw`);

  return response.data;
};


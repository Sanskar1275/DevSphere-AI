import API from "./axios";

// ==========================================
// GET ALL APPLICATIONS
// ==========================================

export const getAllApplications = async (filters = {}) => {
  const params = {};

  if (filters.status && filters.status !== "All") {
    params.status = filters.status;
  }

  if (filters.jobId) {
    params.jobId = filters.jobId;
  }

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  const response = await API.get("/applications/admin/all", {
    params,
  });

  return response.data;
};

// ==========================================
// GET APPLICATION STATISTICS
// ==========================================

export const getApplicationStats = async () => {
  const response = await API.get("/applications/admin/stats");

  return response.data;
};

// ==========================================
// GET SINGLE APPLICATION
// ==========================================

export const getAdminApplicationById = async (applicationId) => {
  const response = await API.get(`/applications/admin/${applicationId}`);

  return response.data;
};

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await API.patch(
    `/applications/admin/${applicationId}/status`,
    {
      status,
    },
  );

  return response.data;
};

import API from "./axios";

// ==========================================
// GET MY RESUME
// ==========================================

export const getMyResume = async () => {
  const response = await API.get("/resume");

  return response.data;
};

// ==========================================
// CREATE / UPDATE MY RESUME
// ==========================================

export const saveMyResume = async (resumeData) => {
  const response = await API.put(
    "/resume",
    resumeData
  );

  return response.data;
};

// ==========================================
// DELETE MY RESUME
// ==========================================

export const deleteMyResume = async () => {
  const response = await API.delete("/resume");

  return response.data;
};
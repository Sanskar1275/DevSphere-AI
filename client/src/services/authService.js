import API from "./axios";

// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async () => {
  const response = await API.get("/auth/profile");

  return response.data;
};

// ==========================================
// UPDATE PROFESSIONAL PROFILE
// ==========================================

export const updateProfile = async (profileData) => {
  const response = await API.put("/auth/profile", profileData);

  return response.data;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (currentPassword, newPassword) => {
  const response = await API.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

// ==========================================
// UPDATE NOTIFICATIONS
// ==========================================

export const updateNotifications = async (notifications) => {
  const response = await API.put("/auth/notifications", notifications);

  return response.data;
};

// ==========================================
// DELETE ACCOUNT
// ==========================================

export const deleteAccount = async () => {
  const response = await API.delete("/auth/account");

  return response.data;
};

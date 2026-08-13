import API from "./axios";

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async (search = "", role = "all") => {
  const response = await API.get("/admin/users", {
    params: {
      search,
      role,
    },
  });

  return response.data;
};

// ==========================================
// UPDATE USER ROLE
// ==========================================

export const updateUserRole = async (userId, role) => {
  const response = await API.put(`/admin/users/${userId}/role`, {
    role,
  });

  return response.data;
};

// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = async (userId) => {
  const response = await API.delete(`/admin/users/${userId}`);

  return response.data;
};

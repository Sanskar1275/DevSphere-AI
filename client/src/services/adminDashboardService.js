import API from "./axios";

export const getAdminStats = async () => {
  const res = await API.get("/admin/stats");

  return res.data.stats;
};

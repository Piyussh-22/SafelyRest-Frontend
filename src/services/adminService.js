import api from "./api.js";

export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const adminDeleteHouse = async (houseId) => {
  const res = await api.delete(`/admin/houses/${houseId}`);
  return res.data;
};

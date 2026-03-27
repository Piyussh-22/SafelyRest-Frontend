import api from "./api.js";

export const getFavorites = async () => {
  const res = await api.get("/store/favourites");
  return res.data;
};

export const toggleFavorite = async (houseId) => {
  const res = await api.post("/store/favourites", { houseId });
  return res.data;
};

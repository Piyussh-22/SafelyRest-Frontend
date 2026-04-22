import api from "./api";

export const getFavorites = async () => {
  const res = await api.get("/store/favourites");
  console.log(res.data);
  return res.data.data;
};

export const toggleFavorite = async (houseId: string) => {
  const res = await api.post("/store/favourites", { houseId });
  return res.data;
};

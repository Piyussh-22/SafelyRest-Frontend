import api, { setAuthToken } from "./api";

// Fetch all favorites
export const getFavorites = async (token) => {
  try {
    setAuthToken(token);
    const res = await api.get("/store/favourites");
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch favourites"
    );
  }
};

// Toggle favorite house
export const toggleFavorite = async (houseId, token) => {
  try {
    setAuthToken(token);
    const res = await api.post("/store/favourites", { houseId });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to toggle favourite"
    );
  }
};

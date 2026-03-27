import api from "./api.js";

// Public
export const getHouses = async (params = {}) => {
  const res = await api.get("/store/houses", { params });
  return res.data;
};

export const getHouseById = async (houseId) => {
  const res = await api.get(`/store/houses/${houseId}`);
  return res.data;
};

export const checkAvailability = async (houseId, checkIn, checkOut) => {
  const res = await api.get(`/store/houses/${houseId}/availability`, {
    params: { checkIn, checkOut },
  });
  return res.data;
};

// Host-only
export const getHostHouses = async () => {
  const res = await api.get("/host/houses");
  return res.data;
};

export const createHouse = async (formData, onUploadProgress) => {
  const res = await api.post("/host/houses", formData, {
    onUploadProgress: (e) => {
      if (onUploadProgress) {
        onUploadProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return res.data;
};

export const deleteHouse = async (houseId) => {
  const res = await api.delete(`/host/houses/${houseId}`);
  return res.data;
};

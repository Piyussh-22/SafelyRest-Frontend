import api from "./api";
import { Filters } from "../types";

export const getHouses = async (
  params: Filters & Record<string, unknown> = {},
) => {
  const res = await api.get("/store/houses", { params });
  return res.data.data || res.data.houses;
};

export const getHouseById = async (houseId: string) => {
  const res = await api.get(`/store/houses/${houseId}`);
  return res.data;
};

export const checkAvailability = async (
  houseId: string,
  checkIn: string,
  checkOut: string,
) => {
  const res = await api.get(`/store/houses/${houseId}/availability`, {
    params: { checkIn, checkOut },
  });
  return res.data;
};

export const getHostHouses = async () => {
  const res = await api.get("/host/houses");
  return res.data;
};

export const createHouse = async (
  formData: FormData,
  onUploadProgress?: (percent: number) => void,
) => {
  const res = await api.post("/host/houses", formData, {
    onUploadProgress: (e) => {
      if (onUploadProgress && e.total) {
        onUploadProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return res.data;
};

export const deleteHouse = async (houseId: string) => {
  const res = await api.delete(`/host/houses/${houseId}`);
  return res.data;
};

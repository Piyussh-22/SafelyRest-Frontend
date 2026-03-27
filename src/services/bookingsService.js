import api from "./api.js";

// Guest
export const createBooking = async (payload) => {
  const res = await api.post("/bookings", payload);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await api.get("/bookings/my");
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await api.patch(`/bookings/${bookingId}/cancel`);
  return res.data;
};

// Host
export const getHostBookings = async () => {
  const res = await api.get("/bookings/host");
  return res.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const res = await api.patch(`/bookings/${bookingId}/status`, { status });
  return res.data;
};

// Admin
export const getAllBookings = async (params = {}) => {
  const res = await api.get("/admin/bookings", { params });
  return res.data;
};

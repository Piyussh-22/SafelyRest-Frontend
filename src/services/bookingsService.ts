import api from "./api";
import { Booking } from "../types";

export interface CreateBookingPayload {
  houseId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string;
}

export type BookingStatus = Booking["status"];

export const createBooking = async (payload: CreateBookingPayload) => {
  const res = await api.post("/bookings", payload);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await api.get("/bookings/my");
  return res.data;
};

export const cancelBooking = async (bookingId: string) => {
  const res = await api.patch(`/bookings/${bookingId}/cancel`);
  return res.data;
};

export const getHostBookings = async () => {
  const res = await api.get("/bookings/host");
  return res.data;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
) => {
  const res = await api.patch(`/bookings/${bookingId}/status`, { status });
  return res.data;
};

export const getAllBookings = async (params: Record<string, unknown> = {}) => {
  const res = await api.get("/admin/bookings", { params });
  return res.data;
};

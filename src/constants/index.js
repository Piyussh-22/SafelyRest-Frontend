export const ROLES = {
  GUEST: "guest",
  HOST: "host",
  ADMIN: "admin",
};

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

export const AMENITIES = [
  { value: "wifi", label: "WiFi" },
  { value: "parking", label: "Parking" },
  { value: "ac", label: "AC" },
  { value: "heating", label: "Heating" },
  { value: "kitchen", label: "Kitchen" },
  { value: "tv", label: "TV" },
  { value: "pool", label: "Pool" },
  { value: "gym", label: "Gym" },
];

export const ROUTES = {
  HOME: "/",
  HOUSES: "/houses",
  HOUSE_DETAILS: "/houses/:id",
  FAVORITES: "/favorites",
  LOGIN: "/login",
  SIGNUP: "/signup",
  MY_BOOKINGS: "/bookings/my",
  HOST_HOUSES: "/host/houses",
  HOST_ADD_HOUSE: "/host/add-house",
  HOST_BOOKINGS: "/host/bookings",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_BOOKINGS: "/admin/bookings",
};

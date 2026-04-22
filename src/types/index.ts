export interface User {
  id: string;
  firstName: string;
  email: string;
  userType: "guest" | "host" | "admin";
}

export interface ApiUser {
  _id?: string;
  id?: string;
  firstName: string;
  email: string;
  userType: "guest" | "host" | "admin";
  createdAt?: string;
}

export interface House {
  _id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  photos: string[];
  amenities: string[];
  capacity: number;
  owner: string | PopulatedOwner;
  isAvailable: boolean;
}

export interface PopulatedOwner {
  _id: string;
  firstName: string;
  email: string;
}

export interface Booking {
  _id: string;
  house: string | PopulatedHouse;
  guest: string | PopulatedGuest;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  message?: string;
  hostContact?: { firstName?: string; email?: string };
}

export interface PopulatedHouse {
  _id: string;
  name: string;
  location: string;
  price: number;
  photos: string[];
  capacity: number;
  owner: string;
}

export interface PopulatedGuest {
  _id: string;
  firstName: string;
  email: string;
}

export interface Favorite {
  _id: string;
  userId: string;
  houseId: string | House;
  savedAt: Date;
}

export interface AdminStats {
  totalMembers: number;
  totalHosts: number;
  totalGuests: number;
  totalHouses: number;
  recentUsers: ApiUser[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  email: string;
  password: string;
  userType?: "guest" | "host";
}

export interface Filters {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string[];
}

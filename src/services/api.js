import axios from "axios";

// Create a single axios instance
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Helper to set/remove token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;

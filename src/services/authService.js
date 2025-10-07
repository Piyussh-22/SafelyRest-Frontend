import api from "./api";

// Login
export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

// Signup
export const signup = async (data) => {
  try {
    const res = await api.post("/auth/signup", data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Signup failed");
  }
};

// Logout
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.warn("Logout failed:", err.response?.data?.message || err.message);
  }
};

// Google login
export const googleLogin = async (data) => {
  try {
    const res = await api.post("/auth/google-login", data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Google login failed");
  }
};

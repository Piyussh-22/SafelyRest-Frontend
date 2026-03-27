import api from "./api.js";

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const signup = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const googleLogin = async (payload) => {
  const res = await api.post("/auth/google-login", payload);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout").catch(() => {});
};

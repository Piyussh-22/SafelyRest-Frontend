import api from "./api";
import { LoginCredentials, SignupData } from "../types";

export const login = async (credentials: LoginCredentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const signup = async (userData: SignupData) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const googleLogin = async (payload: { credential: string }) => {
  const res = await api.post("/auth/google-login", payload);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout").catch(() => {});
};

import api from "./axios";

// Login
export const loginApi = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

// Register
export const registerApi = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};
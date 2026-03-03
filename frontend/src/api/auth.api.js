// src/api/auth.api.js
import axios from "./axios";

// Login function
export const loginApi = async (payload) => {
  const response = await axios.post("/auth/login", payload);
  return response.data;
};

// Register function
export const registerApi = async (payload) => {
  const response = await axios.post("/auth/register", payload);
  return response.data;
};
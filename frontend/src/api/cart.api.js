import api from "./axios";

export const getCart = () => api.get("/cart");

export const addToCart = (payload) =>
  api.post("/cart", payload);

export const removeFromCart = (cartItemId) =>
  api.delete(`/cart/${cartItemId}`);
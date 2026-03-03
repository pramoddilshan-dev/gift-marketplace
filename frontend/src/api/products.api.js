import api from "./axios";

export const getProducts = (page = 1) => api.get(`/products?page=${page}`);
export const getProductById = (id) => api.get(`/products/${id}`);

// Seller/Admin operations
export const createProduct = (data) =>
  api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteProduct = (id) => api.delete(`/products/${id}`);
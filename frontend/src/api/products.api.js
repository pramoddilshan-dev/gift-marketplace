import api from "./axios";

// fetch products with optional pagination and category filter
// options: { page, category }
export const getProducts = (options = {}) => {
  const { page = 1, category, search } = options;
  let url = `/products?page=${page}`;
  if (category) url += `&category=${category}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  return api.get(url);
};
export const getProductById = (id) => api.get(`/products/${id}`);

// Seller/Admin operations
export const createProduct = (data) =>
  api.post("/products", data);
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
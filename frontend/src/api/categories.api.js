import api from "./axios";

export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/admin/categories", data);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);
import API from './axios';

export const getCategories = async () => {
  return await API.get('/categories');
};

export const createCategory = async (data) => {
  return await API.post('/categories', data);
};

export const deleteCategory = async (id) => {
  return await API.delete(`/categories/${id}`);
};
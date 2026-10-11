import API from './axios';

export const getAllUsers = async () => {
  return await API.get('/admin/users');
};

export const toggleUserStatus = async (id) => {
  return await API.put(`/admin/users/${id}/toggle-status`);
};

export const getAllOrders = async () => {
  return await API.get('/admin/orders');
};

export const adminDeactivateProduct = async (id) => {
  return await API.put(`/admin/products/${id}/deactivate`);
};
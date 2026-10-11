import API from './axios';

export const getProducts = async (params) => {
  return await API.get('/products', { params });
};

export const getProductById = async (id) => {
  return await API.get(`/products/${id}`);
};

export const createProduct = async (productData) => {
  return await API.post('/products', productData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProduct = async (id, productData) => {
  return await API.put(`/products/${id}`, productData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteProduct = async (id) => {
  return await API.delete(`/products/${id}`);
};
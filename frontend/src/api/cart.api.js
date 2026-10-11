import API from './axios';

export const getCart = async () => {
  return await API.get('/cart');
};

export const addToCart = async (data) => {
  return await API.post('/cart', data);
};

export const updateCartItem = async (data) => {
  return await API.put('/cart', data);
};

export const removeFromCart = async (id) => {
  return await API.delete(`/cart/${id}`);
};
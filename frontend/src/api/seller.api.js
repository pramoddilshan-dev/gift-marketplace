import API from './axios';

export const getMyProducts = async () => {
  return await API.get('/seller/products');
};

export const getMySalesOrders = async () => {
  return await API.get('/seller/orders');
};
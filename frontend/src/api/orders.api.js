import API from './axios';

export const checkoutOrder = async (data) => {
  return await API.post('/orders/checkout', data);
};

export const buyProductNow = async (data) => {
  return await API.post('/orders/buy-now', data);
};

export const getMyOrders = async () => {
  return await API.get('/orders/my-orders');
};
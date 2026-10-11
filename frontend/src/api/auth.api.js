import API from './axios';

export const registerUser = async (userData) => {
  return await API.post('/auth/register', userData);
};

export const loginUser = async (credentials) => {
  return await API.post('/auth/login', credentials);
};
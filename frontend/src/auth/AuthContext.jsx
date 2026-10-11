import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state directly from LocalStorage (Lazy Initialization)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);
      const { token: authToken, user: authUser } = res.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));

      setToken(authToken);
      setUser(authUser);
      return authUser;
    } catch (err) {
      throw err.response?.data?.message || "Login failed";
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerUser(userData);
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || "Registration failed";
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('learnmate_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password, role = 'student') => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password, role });
      const userData = res.data;
      localStorage.setItem('learnmate_token', userData.token);
      localStorage.setItem('learnmate_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'student', studentId = '', className = '') => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role, studentId, className });
      const userData = res.data;
      localStorage.setItem('learnmate_token', userData.token);
      localStorage.setItem('learnmate_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('learnmate_token');
    localStorage.removeItem('learnmate_user');
    setUser(null);
  };

  const updateUserStats = (updatedFields) => {
    if (!user) return;
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
    localStorage.setItem('learnmate_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserStats }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

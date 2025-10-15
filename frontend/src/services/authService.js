// ============================================
// services/authService.js
// ============================================
import api from './api';

export const authService = {
  // Login
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถเข้าสู่ระบบได้');
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
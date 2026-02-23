import { apiClient } from './api';
import { loginData, registerData } from '../lib/definitions';

export const authService = {
  login: async (credentials: loginData) => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: registerData) => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    console.log("Logout initiated 2");
    return apiClient('/auth/logout', {
      method: 'POST',
    });
  }
};
import { apiClient } from './api';
import { loginData, registerData } from '../lib/definitions';

export const authService = {
  login: async (credentials: loginData) => {
    console.log('Attempting to log in with credentials:', credentials);
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
  }
};
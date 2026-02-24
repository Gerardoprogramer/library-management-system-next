import { api } from "@/lib/axios";
import { loginData, registerData } from "@/lib/definitions";

export const authService = {
  login: async (credentials: loginData) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: registerData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
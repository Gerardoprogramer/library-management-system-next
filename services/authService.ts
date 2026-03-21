import { api } from "@/lib/axios";
import type {
  loginData,
  registerData,
  ApiResponse,
  User
} from "@/lib/definitions";

export const authService = {
  login: async (credentials: loginData): Promise<User> => {
    const response = await api.post<ApiResponse<User>>("/auth/login", credentials);

    if (!response.data.data) {
      throw new Error(response.data.message || "Error al iniciar sesión");
    }

    return response.data.data;
  },

  register: async (userData: registerData): Promise<void> => {
    const response = await api.post<ApiResponse<void>>("/auth/register", userData);

    if (!response.data.success) {
      throw new Error(response.data.message || "Error en el registro");
    }
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
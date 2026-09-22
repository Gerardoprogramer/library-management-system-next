import type { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

import { api } from "@/lib/axios";
import type { ApiResponse, ForgotPasswordRequest, ResetPasswordRequest, User } from "@/lib/definitions";

export const authService = {
  login: async (credentials: LoginFormData): Promise<User> => {
    const response = await api.post<ApiResponse<User>>("/auth/login", credentials);

    if (!response.data.data) {
      throw new Error(response.data.message || "No fue posible iniciar sesión");
    }

    return response.data.data;
  },

  register: async (userData: RegisterFormData): Promise<void> => {
    const response = await api.post<ApiResponse<void>>("/auth/register", userData);

    if (!response.data.success) {
      throw new Error(response.data.message || "No fue posible crear la cuenta");
    }
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<void> => {
    const response = await api.post<ApiResponse<void>>("/auth/forgot-password", payload);

    if (!response.data.success) {
      throw new Error(response.data.message || "No fue posible solicitar el restablecimiento");
    }
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    const response = await api.post<ApiResponse<void>>("/auth/reset-password", payload);

    if (!response.data.success) {
      throw new Error(response.data.message || "No fue posible restablecer la contraseña");
    }
  },
};

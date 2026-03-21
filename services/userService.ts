import { api } from "@/lib/axios";
import { User, ApiResponse } from "@/lib/definitions";

export const userService = {
  me: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>("/users/me");

    if (!response.data.data) {
      throw new Error("No se pudo obtener la información del usuario");
    }

    return response.data.data;
  },
};
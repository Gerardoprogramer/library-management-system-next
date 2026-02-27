import { api } from "@/lib/axios";
import type { ApiResponse, Genre } from "@/lib/definitions";

export const genreService = {
  genres: async (): Promise<Genre[]> => {
    const response = await api.get<ApiResponse<Genre[]>>("/genres");

    return response.data.data ?? [];
  },
};
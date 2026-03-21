import { api } from "@/lib/axios";
import type { BookSummary, ApiResponse, PageResponse, BookDetail } from "@/lib/definitions";

export const bookService = {

  search: async (params?: {
    searchTerm?: string;
    genreId?: string;
    availableOnly?: boolean;
    page?: number;
    size?: number;
  }): Promise<PageResponse<BookSummary>> => {

    const response = await api.get<ApiResponse<PageResponse<BookSummary>>>(
      "/book/search",
      { params: { ...params, page: params?.page ?? 0 } }
    );

    return response.data.data ?? {
      content: [],
      number: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      first: true,
      empty: true
    };
  },

  book: async (id: string): Promise<BookDetail> => {
    const response = await api.get<ApiResponse<BookDetail>>(`/book/${id}`);

    if (!response.data.data) {
      throw new Error(response.data.message || "Libro no encontrado");
    }

    return response.data.data;
  },
};
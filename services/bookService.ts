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
      { params }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  },
  book: async (id: string): Promise<BookDetail> => {
    const response = await api.get<ApiResponse<BookDetail>>(`/book/${id}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  },
};
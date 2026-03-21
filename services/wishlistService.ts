import { api } from "@/lib/axios";
import { myWishlist, ApiResponse, PageResponse } from "@/lib/definitions";

export const WishListService = {
  add: async (bookId: string): Promise<void> => {
    await api.post(`/wishlist/${bookId}`);
  },
  remove: async (bookId: string): Promise<void> => {
    await api.delete(`/wishlist/${bookId}`);
  },
  getMyWishlist: async (page?: string): Promise<PageResponse<myWishlist>> => {
    const response = await api.get<ApiResponse<PageResponse<myWishlist>>>(`/wishlist`, {
      params: { page }
    });

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
};
import { api } from "@/lib/axios";
import { myWishlist, ApiResponse, PageResponse } from "@/lib/definitions";

export const WishListService = {
  add: async (bookId: string): Promise<void> => {
    await api.post(`/wishlist/${bookId}`);
  },
  remove: async (bookId: string): Promise<void> => {
    await api.delete(`/wishlist/${bookId}`);
  },
  getMyWishlist: async (page?: string): Promise<ApiResponse<PageResponse<myWishlist>>> => {
    const response = await api.get(`wishlist`
      , {
        params: page
      }
    );
    return response.data.data;
  },
};
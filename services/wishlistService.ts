import { api } from "@/lib/axios";

export const WishListService = {
  add: async (bookId: string): Promise<void> => {
    await api.post(`/wishlist/${bookId}`);
  },
  remove: async (bookId: string): Promise<void> => {
    await api.delete(`/wishlist/${bookId}`);
  },
};
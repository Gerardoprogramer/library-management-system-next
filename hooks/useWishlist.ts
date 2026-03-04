import type { BookDetail, BookSummary, PageResponse } from "@/lib/definitions";
import { WishListService } from "@/services/wishlistService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWishlist = () => {
  const queryClient = useQueryClient();

  const toggleWishlistMutation = useMutation({
    mutationFn: ({ bookId, isInWishlist }: { bookId: string; isInWishlist: boolean }) =>
      isInWishlist
        ? WishListService.remove(bookId)
        : WishListService.add(bookId),

    onSuccess: (_, variables) => {
      const newValue = !variables.isInWishlist;

      queryClient.setQueryData(["book", variables.bookId], (old: BookDetail) => {
        if (!old) return old;

        return {
          ...old,
          isWishList: newValue,
        };
      });

      queryClient.setQueriesData<PageResponse<BookSummary>>(
        { queryKey: ["books"], exact: false },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            content: old.content.map((book) =>
              book.id === variables.bookId
                ? { ...book, isWishList: newValue }
                : book
            ),
          };
        }
      );
    },
  });

  return {
    handleWishlistToggle: (bookId: string, isInWishlist: boolean) =>
      toggleWishlistMutation.mutate({ bookId, isInWishlist }),

    isLoading: toggleWishlistMutation.isPending,
  };
};
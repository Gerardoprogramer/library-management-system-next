import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BookDetail, BookSummary, PageResponse } from "@/lib/definitions";
import { showToast } from "@/lib/toast-utils";
import { WishListService } from "@/services/wishlistService";

interface WishlistMutation {
  bookId: string;
  isInWishlist: boolean;
}

export const useWishlistActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, isInWishlist }: WishlistMutation) =>
      isInWishlist ? WishListService.remove(bookId) : WishListService.add(bookId),

    onMutate: async (variables) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["books"],
        }),
        queryClient.cancelQueries({
          queryKey: ["book", variables.bookId],
        }),
      ]);

      const previousBooks = queryClient.getQueriesData<PageResponse<BookSummary>>({
        queryKey: ["books"],
      });

      const previousBookDetail = queryClient.getQueryData<BookDetail>(["book", variables.bookId]);

      const newValue = !variables.isInWishlist;

      queryClient.setQueryData<BookDetail>(["book", variables.bookId], (previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          isWishList: newValue,
        };
      });

      queryClient.setQueriesData<PageResponse<BookSummary>>(
        {
          queryKey: ["books"],
        },
        (previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            content: previous.content.map((book) =>
              book.id === variables.bookId
                ? {
                    ...book,
                    isWishList: newValue,
                  }
                : book
            ),
          };
        }
      );

      return {
        previousBooks,
        previousBookDetail,
      };
    },

    onError: (error, variables, context) => {
      context?.previousBooks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousBookDetail) {
        queryClient.setQueryData(["book", variables.bookId], context.previousBookDetail);
      }

      showToast.apiError(error);
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });

      queryClient.invalidateQueries({
        queryKey: ["book", variables.bookId],
      });

      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "wishlist"],
      });
    },
  });
};

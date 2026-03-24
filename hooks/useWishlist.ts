import type { BookDetail, BookSummary, PageResponse, myWishlist } from "@/lib/definitions";
import { WishListService } from "@/services/wishlistService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toast-utils";
import { useQuery } from "@tanstack/react-query";
import { useUrlFilters } from "@/hooks/useUrlFilters";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { get } = useUrlFilters();
  const page = Number(get("wishlistPage", "1"));


  const { data: wishlist } = useQuery<PageResponse<myWishlist>>({
    queryKey: ["wishlist", page],
    queryFn: () => WishListService.getMyWishlist(page - 1),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: ({ bookId, isInWishlist }: { bookId: string; isInWishlist: boolean }) =>
      isInWishlist ? WishListService.remove(bookId) : WishListService.add(bookId),

    onMutate: async (variables) => {

      await queryClient.cancelQueries({ queryKey: ["books"] });
      await queryClient.cancelQueries({ queryKey: ["book", variables.bookId] });

      const previousBooks = queryClient.getQueryData(["books"]);
      const previousBookDetail = queryClient.getQueryData(["book", variables.bookId]);

      const newValue = !variables.isInWishlist;

      queryClient.setQueryData(["book", variables.bookId], (old: BookDetail | undefined) => {
        if (!old) return old;
        return { ...old, isWishList: newValue };
      });

      queryClient.setQueriesData<PageResponse<BookSummary>>(
        { queryKey: ["books"], exact: false },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.map((book) =>
              book.id === variables.bookId ? { ...book, isWishList: newValue } : book
            ),
          };
        }
      );

      return { previousBooks, previousBookDetail };
    },

    onError: (err, variables, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(["books"], context.previousBooks);
      }
      if (context?.previousBookDetail) {
        queryClient.setQueryData(["book", variables.bookId], context.previousBookDetail);
      }

      showToast.apiError(err);
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book", variables.bookId] });

      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });


  return {
    wishlist,
    handleWishlistToggle: (bookId: string, isInWishlist: boolean) =>
      toggleWishlistMutation.mutate({ bookId, isInWishlist }),
  };
};
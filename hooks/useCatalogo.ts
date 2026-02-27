
import { bookService } from "@/services/bookService";
import { useQuery } from "@tanstack/react-query";
import { WishListService } from "@/services/wishlistService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useCatalogo = () => {
     const searchParams = useSearchParams();
  const queryPage = searchParams.get("page") ?? "0";
  const filters = {
    searchTerm: "",
    availableOnly: false,
    page: isNaN(+queryPage) ? 0 : +queryPage - 1,
    size: 8,
  };

  const { data: books, isLoading, isFetching } = useQuery({
    queryKey: ["books", filters],
    queryFn: () => bookService.search(filters),
    placeholderData: (prev) => prev
  });

  const queryClient = useQueryClient();

  const toggleWishlistMutation = useMutation({
    mutationFn: ({ bookId, isInWishlist }: { bookId: string; isInWishlist: boolean }) =>
      isInWishlist
        ? WishListService.remove(bookId)
        : WishListService.add(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleWishlistToggle = (bookId: string, isInWishlist: boolean) => {
    toggleWishlistMutation.mutate({ bookId, isInWishlist });
  };

  return {
    books,
    isLoading,
    isFetching,
    handleWishlistToggle,
  }
}

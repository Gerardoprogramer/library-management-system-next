
import { bookService } from "@/services/bookService";
import { useQuery } from "@tanstack/react-query";
import { WishListService } from "@/services/wishlistService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { genreService } from "@/services/genreService";
import type { Genre } from "@/lib/definitions";
import { useRouter } from "next/navigation";

export const useCatalogo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const queryPage = searchParams.get("page") ?? "1";
  const queryGenre = searchParams.get("genre") ?? "all";
  const queryAvailable = searchParams.get("availableOnly") === "true";
  const querySearchTerm = searchParams.get("searchTerm") ?? "";

  const updateParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (!value || value === "all") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    router.replace(`?${newParams.toString()}`);
  };

  const { data: books, isLoading } = useQuery({
    queryKey: [
      "books",
      querySearchTerm,
      queryGenre,
      queryAvailable,
      queryPage],
    queryFn: () => bookService.search({
      searchTerm: querySearchTerm,
      genreId: queryGenre === "all" ? undefined : queryGenre,
      availableOnly: queryAvailable,
      page: isNaN(+queryPage) ? 0 : +queryPage - 1,
      size: 8,
    }),
    placeholderData: (prev) => prev,
  });

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: genreService.genres,
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: ({ bookId, isInWishlist }: { bookId: string; isInWishlist: boolean }) =>
      isInWishlist
        ? WishListService.remove(bookId)
        : WishListService.add(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return {
    books,
    genres,
    selectedGenre: queryGenre,
    availableOnly: queryAvailable,
    searchTerm: querySearchTerm,
    isLoading,
    setSelectedGenre: (genre: string) =>
      updateParams({ genre, page: "1" }),
    toggleAvailableOnly: () =>
      updateParams({
        availableOnly: (!queryAvailable).toString(),
        page: "1",
      }),
    setSearchTerm: (term: string) =>
      updateParams({ searchTerm: term, page: "1" }),
    handleWishlistToggle: (bookId: string, isInWishlist: boolean) =>
      toggleWishlistMutation.mutate({ bookId, isInWishlist }),
  };
};
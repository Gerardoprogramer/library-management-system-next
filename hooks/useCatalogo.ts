import { useQuery } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import { genreService } from "@/services/genreService";
import type { Genre } from "@/lib/definitions";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { PageResponse, BookSummary } from "@/lib/definitions";

export const useCatalogo = () => {
  const { get, set } = useUrlFilters();

  const page = Number(get("CatalogPage", "1"));
  const genre = get("genre", "all");
  const availableOnly = get("availableOnly") === "true";
  const searchTerm = get("searchTerm");

  const { data: books, isLoading } = useQuery<PageResponse<BookSummary>>({
    queryKey: ["books", { searchTerm, genre, availableOnly, page }],
    queryFn: () =>
      bookService.search({
        searchTerm,
        genreId: genre === "all" ? undefined : genre,
        availableOnly,
        page: page - 1,
        size: 8,
      }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: genreService.genres,
    staleTime: 1000 * 60 * 5,
  });

  return {
    books,
    genres,
    genre,
    availableOnly,
    searchTerm,
    isLoading,

    setGenre: (g: string) =>
      set({
        genre: g,
        CatalogPage: "1",
      }),

    toggleAvailableOnly: () =>
      set({
        availableOnly: !availableOnly,
        CatalogPage: "1",
      }),
  };
};
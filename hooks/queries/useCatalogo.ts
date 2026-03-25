import { useQuery } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import { useGenres } from "./useGenres";
import type { BookSummary, PageResponse } from "@/lib/definitions";

export const useCatalogo = () => {
    const { get, set } = useUrlFilters();
    const { data: genres } = useGenres();

    const filters = {
        page: Number(get("CatalogPage", "1")),
        genre: get("genre", "all"),
        availableOnly: get("availableOnly") === "true",
        searchTerm: get("searchTerm") || "",
    };

    const { data: books, isLoading } = useQuery<PageResponse<BookSummary>>({
        queryKey: ["books", filters],
        queryFn: () =>
            bookService.search({
                searchTerm: filters.searchTerm,
                genreId: filters.genre === "all" ? undefined : filters.genre,
                availableOnly: filters.availableOnly,
                page: filters.page - 1,
                size: 8
            }),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
    });

    const setGenre = (g: string) => {
        set({ genre: g, CatalogPage: "1" });
    };

    const toggleAvailableOnly = () => {
        set({
            availableOnly: !filters.availableOnly,
            CatalogPage: "1"
        });
    };

    return {
        books,
        genres: genres ?? [],
        filters,
        isLoading,
        setGenre,
        toggleAvailableOnly
    };
};
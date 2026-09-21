import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { BookSummary, PageResponse } from "@/lib/definitions";
import { bookService } from "@/services/bookService";

import { useGenres } from "./useGenres";

const parsePage = (value: string) => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

export const useCatalogo = () => {
  const { get, set } = useUrlFilters();
  const { data: genres } = useGenres();

  const rawPage = get("CatalogPage", "1");
  const page = parsePage(rawPage);

  const filters = {
    page,
    genre: get("genre", "all"),
    availableOnly: get("availableOnly") === "true",
    searchTerm: get("searchTerm") || "",
  };

  const {
    data: books,
    isLoading,
    isPlaceholderData,
  } = useQuery<PageResponse<BookSummary>>({
    queryKey: ["books", filters],

    queryFn: () =>
      bookService.search({
        searchTerm: filters.searchTerm,
        genreId: filters.genre === "all" ? undefined : filters.genre,
        availableOnly: filters.availableOnly,
        page: filters.page - 1,
        size: 8,
      }),

    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (rawPage !== String(page)) {
      set({
        CatalogPage: page === 1 ? undefined : String(page),
      });
    }
  }, [page, rawPage, set]);

  useEffect(() => {
    if (!books || isPlaceholderData) {
      return;
    }

    if (books.totalPages === 0 && page !== 1) {
      set({
        CatalogPage: undefined,
      });

      return;
    }

    if (books.totalPages > 0 && page > books.totalPages) {
      set({
        CatalogPage: String(books.totalPages),
      });
    }
  }, [books, isPlaceholderData, page, set]);

  const setGenre = (genre: string) => {
    set({
      genre,
      CatalogPage: "1",
    });
  };

  const toggleAvailableOnly = () => {
    set({
      availableOnly: !filters.availableOnly,
      CatalogPage: "1",
    });
  };

  return {
    books,
    genres: genres ?? [],
    filters,
    isLoading,
    setGenre,
    toggleAvailableOnly,
  };
};

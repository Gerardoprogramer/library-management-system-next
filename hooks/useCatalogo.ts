import { bookService } from "@/services/bookService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { genreService } from "@/services/genreService";
import type { Genre } from "@/lib/definitions";

export const useCatalogo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("CatalogPage") ?? 1);
  const genre = searchParams.get("genre") ?? "all";
  const availableOnly = searchParams.get("availableOnly") === "true";
  const searchTerm = searchParams.get("searchTerm") ?? "";

  const updateParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(Array.from(searchParams.entries()));

    newParams.delete("CatalogPage");

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
    queryKey: ["books", searchTerm, genre, availableOnly, page],
    queryFn: () =>
      bookService.search({
        searchTerm,
        genreId: genre === "all" ? undefined : genre,
        availableOnly,
        page: page - 1,
        size: 8,
      }),
    placeholderData: (prev) => prev,
  });

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: genreService.genres,
  });

  return {
    books,
    genres,
    genre,
    availableOnly,
    searchTerm,
    isLoading,
    setGenre: (g: string) => updateParams({ genre: g }),
    toggleAvailableOnly: () =>
      updateParams({ availableOnly: String(!availableOnly) }),
  };
};
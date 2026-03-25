import { useQuery } from "@tanstack/react-query";
import { genreService } from "@/services/genreService";
import type { Genre } from "@/lib/definitions";

export const useGenres = () => {
    return useQuery<Genre[]>({
        queryKey: ["genres"],
        queryFn: genreService.genres,
        staleTime: 1000 * 60 * 60,
    });
};
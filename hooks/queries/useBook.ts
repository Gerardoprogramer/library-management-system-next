import { useQuery } from "@tanstack/react-query";
import { bookService } from "@/services/bookService";
import type { BookDetail as Book } from "@/lib/definitions";

export const useBook = (id: string) => {
    return useQuery<Book>({
        queryKey: ["book", id],
        queryFn: () => bookService.book(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};
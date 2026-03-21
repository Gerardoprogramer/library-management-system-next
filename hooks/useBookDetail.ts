import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { bookService } from "@/services/bookService";
import { reviewService } from "@/services/reviewService";
import { useWishlist } from "@/hooks/useWishlist";

import type { BookDetail as Book, PageResponse, Review } from "@/lib/definitions";

export function useBookDetail(id: string) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const queryPage = searchParams.get("ReviewPage") ?? "1";

    const { handleWishlistToggle } = useWishlist();

    const handleBack = () => {
        const from = searchParams.get("from");

        if (from) {
            router.push(decodeURIComponent(from));
        } else {
            router.push("/dashboard/catalog");
        }
    };

    const bookQuery = useQuery<Book>({
        queryKey: ["book", id],
        queryFn: () => bookService.book(id),
        placeholderData: (prev) => prev,
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });

    const reviewsQuery = useQuery<PageResponse<Review>>({
        queryKey: ["reviews", { id, queryPage }],
        queryFn: () =>
            reviewService.getBookReviews(
                id,
                isNaN(+queryPage) ? 0 : +queryPage - 1
            ),
        placeholderData: (prev) => prev,
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });

    return {
        handleBack,
        handleWishlistToggle,
        queryPage,
        bookQuery,
        reviewsQuery,
    };
}
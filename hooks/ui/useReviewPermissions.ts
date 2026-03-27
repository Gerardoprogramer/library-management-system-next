import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../queries/useCurrentUser";
import type { PageResponse, meLoans, Review } from "@/lib/definitions";

export const useReviewPermissions = (bookId: string) => {
    const queryClient = useQueryClient();
    const { data: user } = useCurrentUser();

    const allLoansQueries = queryClient.getQueriesData<PageResponse<meLoans>>({
        queryKey: ['loans']
    });

    const allLoans = allLoansQueries.flatMap(query => query[1]?.content || []);

    const allReviewsQueries = queryClient.getQueriesData<PageResponse<Review>>({
        queryKey: ['reviews', { type: 'book', id: bookId }]
    });

    const allReviews = allReviewsQueries.flatMap(query => query[1]?.content || []);

    const hasReturnedBook = allLoans.some(
        (l) => String(l.bookId) === String(bookId) && l.status === "RETURNED"
    );

    const alreadyReviewed = allReviews.some(
        (r) => r.userId === user?.id
    );

    return {
        canCreate: hasReturnedBook && !alreadyReviewed,
        hasReturnedBook,
        alreadyReviewed,
        userReview: allReviews.find(r => r.userId === user?.id)
    };
};
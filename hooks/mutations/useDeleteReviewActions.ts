import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";
import { showToast } from "@/lib/toast-utils";
import { BookDetail, ReviewType } from "@/lib/definitions";
import { PageResponse, Review } from "@/lib/definitions";

export const useDeleteReview = (
    reviewId: string,
    target: ReviewType,
    oldRating: number
) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => reviewService.deleteReview(reviewId),

        onSuccess: () => {
            showToast.success("Reseña eliminada con éxito");

            if (target.type === "mine") {
                queryClient.setQueriesData<PageResponse<Review>>(
                    { queryKey: ["reviews", "mine"] },
                    (oldData) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            content: oldData.content.filter((r) => r.id !== reviewId),
                            totalElements: oldData.totalElements - 1,
                        };
                    }
                );

                queryClient.invalidateQueries({
                    queryKey: ["reviews", "mine"],
                    refetchType: 'active',
                });
            }

            if (target.type === "book") {
                const bookId = target.id;

                queryClient.setQueryData(['book', bookId], (oldBook: BookDetail | undefined) => {
                    if (!oldBook) return oldBook;

                    const totalActual = oldBook.totalReviews || 0;
                    if (totalActual <= 1) {
                        return {
                            ...oldBook,
                            totalReviews: 0,
                            averageRating: 0,
                            alreadyReviewed: false,
                            canReview: true
                        };
                    }

                    const nuevoTotal = totalActual - 1;
                    const nuevaSuma = (Number(oldBook.averageRating) * totalActual) - Number(oldRating);

                    return {
                        ...oldBook,
                        totalReviews: nuevoTotal,
                        averageRating: Number((nuevaSuma / nuevoTotal).toFixed(1)),
                        alreadyReviewed: false,
                        canReview: true
                    };
                });

                queryClient.invalidateQueries({
                    queryKey: ["reviews", "book", bookId],
                    refetchType: 'active'
                });
            }

            queryClient.invalidateQueries({
                queryKey: ['books'],
                refetchType: 'none'
            });
        },

        onError: (error: any) => {
            showToast.apiError(error);
        },
    });

    return {
        deleteReview: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};
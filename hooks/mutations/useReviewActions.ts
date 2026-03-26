import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";
import { showToast } from "@/lib/toast-utils";
import { editReview, BookDetail } from "@/lib/definitions";
import type { ReviewType } from "@/lib/definitions";

export const useReviewActions = (
    reviewId: string,
    target: ReviewType,
    oldRating: number
) => {
    const queryClient = useQueryClient();

    const reviewMutation = useMutation({
        mutationFn: (reviewData: editReview) =>
            reviewService.editReview(reviewData, reviewId),

        onSuccess: (data, variables) => {
            showToast.success("Reseña actualizada con éxito");

            queryClient.invalidateQueries({
                queryKey: ["reviews", target]
            });

            if (target.type === "book") {
                const bookId = target.id;

                queryClient.setQueryData(['book', bookId], (oldBook: BookDetail | undefined) => {
                    if (!oldBook) return oldBook;

                    const total = oldBook.totalReviews || 0;
                    if (total === 0) return oldBook;

                    console.log(oldRating)

                    const ratingAnterior = Number(oldRating);
                    const ratingNuevo = Number(variables.rating);
                    const promedioActual = Number(oldBook.averageRating);

                    const sumaAnterior = promedioActual * total;
                    const nuevaSuma = (sumaAnterior - ratingAnterior) + ratingNuevo;
                    const nuevoPromedio = nuevaSuma / total;

                    return {
                        ...oldBook,
                        averageRating: Number(nuevoPromedio.toFixed(1))
                    };
                });
            }
        },

        onError: (error: any) => {
            showToast.apiError(error);
        },
    });

    return {
        performReview: reviewMutation.mutate,
        isPending: reviewMutation.isPending,
    };
};
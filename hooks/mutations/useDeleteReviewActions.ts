import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";
import { showToast } from "@/lib/toast-utils";
import { BookDetail, ReviewType } from "@/lib/definitions";

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


            if (target.type === "book") {
                const bookId = target.id;

                queryClient.invalidateQueries({
                    queryKey: ["reviews", "book", bookId]
                });

                queryClient.setQueryData(['book', bookId], (oldBook: BookDetail | undefined) => {
                    if (!oldBook) return oldBook;

                    const totalActual = oldBook.totalReviews || 0;

                    if (totalActual <= 1) {
                        return {
                            ...oldBook,
                            totalReviews: 0,
                            averageRating: 0,
                        };
                    }

                    const nuevoTotal = totalActual - 1;
                    const promedioActual = Number(oldBook.averageRating);
                    const ratingAEliminar = Number(oldRating);

                    const sumaAnterior = promedioActual * totalActual;
                    const nuevaSuma = sumaAnterior - ratingAEliminar;
                    const nuevoPromedio = nuevaSuma / nuevoTotal;

                    return {
                        ...oldBook,
                        totalReviews: nuevoTotal,
                        averageRating: Number(nuevoPromedio.toFixed(1)),
                        alreadyReviewed: !oldBook.alreadyReviewed,
                        canReview: !oldBook.canReview
                    };
                });

                queryClient.invalidateQueries({
                    queryKey: ['books'],
                    refetchType: 'none'
                });
            }
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
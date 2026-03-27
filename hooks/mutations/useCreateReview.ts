import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";
import { showToast } from "@/lib/toast-utils";
import { createReview, BookDetail, ReviewType } from "@/lib/definitions";

export const useCreateReview = (target: ReviewType) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewData: createReview) => 
            reviewService.createReview(reviewData),

        onSuccess: (newReview, variables) => {
            showToast.success("Reseña publicada con éxito");

            queryClient.invalidateQueries({
                queryKey: ["reviews", target]
            });

            if (target.type === "book") {
                const bookId = target.id;

                queryClient.setQueryData(['book', bookId], (oldBook: BookDetail | undefined) => {
                    if (!oldBook) return oldBook;

                    const totalAnterior = oldBook.totalReviews || 0;
                    const nuevoTotal = totalAnterior + 1;
                    
                    const promedioActual = Number(oldBook.averageRating) || 0;
                    const nuevoRating = Number(variables.rating);

                    const sumaPuntos = (promedioActual * totalAnterior) + nuevoRating;
                    const nuevoPromedio = sumaPuntos / nuevoTotal;

                    return {
                        ...oldBook,
                        totalReviews: nuevoTotal,
                        averageRating: Number(nuevoPromedio.toFixed(1))
                    };
                });
            }
        },

        onError: (error: any) => {
            showToast.apiError(error);
        },
    });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showToast } from "@/lib/toast-utils";
import { reservationService } from "@/services/reservationService";

export const useCancelReservation = (bookId: string) => {
  const queryClient = useQueryClient();

  const cancellation = useMutation({
    mutationFn: (reservationId: string) => reservationService.cancel(reservationId),

    onSuccess: (response) => {
      showToast.success("Reserva cancelada", response.message);

      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "reservations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["book", bookId],
      });

      queryClient.invalidateQueries({
        queryKey: ["book-user-status", bookId],
      });
    },

    onError: (error) => {
      showToast.apiError(error);
    },
  });

  return {
    cancelReservation: cancellation.mutate,
    isCancelling: cancellation.isPending,
  };
};

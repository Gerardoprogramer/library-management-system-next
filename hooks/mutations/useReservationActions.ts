import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "@/services/reservationService";
import { showToast } from "@/lib/toast-utils";
import { reserve } from "@/lib/definitions";

export const useReservationActions = (bookId: string) => {
  const queryClient = useQueryClient();

  const reserveMutation = useMutation({
    mutationFn: (reservationData: reserve) => 
      reservationService.create(reservationData),
    
    onSuccess: () => {
      showToast.success("Reserva realizada con éxito");
      
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
    
    onError: (error: any) => {
      showToast.apiError(error);
    },
  });

  return {
    performReserve: reserveMutation.mutate,
    isReserving: reserveMutation.isPending,
  };
};
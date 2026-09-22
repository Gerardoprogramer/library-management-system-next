import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showToast } from "@/lib/toast-utils";
import { loansService } from "@/services/loansService";

export const useCheckinLoan = (bookId: string) => {
  const queryClient = useQueryClient();
  const checkin = useMutation({
    mutationFn: (loanId: string) => loansService.checkin({ loanId, status: "RETURNED" }),
    onSuccess: (response) => {
      showToast.success("Libro devuelto", response.message);
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "loans"] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book-user-status", bookId] });
    },
    onError: (error) => showToast.apiError(error),
  });

  return {
    performCheckin: checkin.mutate,
    isCheckingIn: checkin.isPending,
  };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { renewLoan } from "@/lib/definitions";
import { showToast } from "@/lib/toast-utils";
import { loansService } from "@/services/loansService";

export const useRenewLoan = (bookId: string) => {
  const queryClient = useQueryClient();

  const renewal = useMutation({
    mutationFn: (renewData: renewLoan) => loansService.renew(renewData),

    onSuccess: (response) => {
      showToast.success("Préstamo renovado", response.message);

      queryClient.invalidateQueries({
        queryKey: ["loans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "loans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["book", bookId],
      });
    },

    onError: (error) => {
      showToast.apiError(error);
    },
  });

  return {
    performRenewal: renewal.mutate,
    isRenewing: renewal.isPending,
  };
};

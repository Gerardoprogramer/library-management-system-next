import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showToast } from "@/lib/toast-utils";
import { SubscriptionService } from "@/services/SubscriptionService";

interface CancelSubscriptionInput {
  reason: string;
  id: string;
}

export const useCancelSubscriptionActions = () => {
  const queryClient = useQueryClient();

  const cancellation = useMutation({
    mutationFn: ({ reason, id }: CancelSubscriptionInput) => SubscriptionService.cancelSubscription(reason, id),

    onSuccess: () => {
      showToast.success("Suscripción cancelada", "Tu suscripción fue cancelada correctamente.");

      queryClient.setQueryData(["subscription"], undefined);

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "subscription"],
      });
    },

    onError: (error) => {
      showToast.apiError(error);
    },
  });

  return {
    cancelSubscription: cancellation.mutate,
    isCancelling: cancellation.isPending,
  };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Subscription } from "@/lib/definitions";
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
      queryClient.setQueryData<Subscription | null>(["subscription"], null);

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "subscription"],
      });

      showToast.success("Suscripción cancelada", "Tu suscripción fue cancelada correctamente.");
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

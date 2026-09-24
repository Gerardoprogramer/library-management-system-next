import { useMutation } from "@tanstack/react-query";

import { showToast } from "@/lib/toast-utils";
import { SubscriptionService } from "@/services/subscriptionService";

interface SubscribeInput {
  planId: string;
  autoRenew: boolean;
  notes: string;
}

export const useSubscribeActions = (setPayDialog: (open: boolean) => void) => {
  const subscribeMutation = useMutation({
    mutationFn: ({ planId, autoRenew, notes }: SubscribeInput) =>
      SubscriptionService.subscribeToPlan(planId, autoRenew, notes),

    onSuccess: (data) => {
      if (!data.checkoutUrl) {
        showToast.error("No se pudo iniciar el pago", "No fue posible obtener el enlace de Stripe.");

        return;
      }

      setPayDialog(false);

      showToast.success("Pago iniciado", "Te estamos redirigiendo a Stripe.");

      window.location.assign(data.checkoutUrl);
    },

    onError: (error) => {
      showToast.apiError(error);
    },
  });

  return {
    subscribeMutation,
    isLoading: subscribeMutation.isPending,
  };
};

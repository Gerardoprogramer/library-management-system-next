import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/lib/toast-utils";
import { SubscriptionPostResponse } from "@/lib/definitions";
import { SubscriptionService } from "@/services/SubscriptionService";

export const useSubscribeActions = (setPayDialog: (open: boolean) => void) => {
  const subscribeMutation = useMutation({
    mutationFn: ({ planId, autoRenew, notes }: { planId: string; autoRenew: boolean; notes: string }) =>
      SubscriptionService.subscribeToPlan(planId, autoRenew, notes),

    onSuccess: (data: SubscriptionPostResponse) => {
      setPayDialog(false);

      showToast.success("Redirigiendo a Stripe para completar el pago...");

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        showToast.error("No se pudo obtener el enlace de pago.");
      }
    },
    onError: (error) => {
      console.error("Subscription Error:", error);
      showToast.apiError(error);
    },
  });

  return {
    subscribeMutation,
    isLoading: subscribeMutation.isPending,
  };
};

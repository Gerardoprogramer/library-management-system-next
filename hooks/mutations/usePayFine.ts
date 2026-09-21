import { useMutation } from "@tanstack/react-query";

import { showToast } from "@/lib/toast-utils";
import { FineService } from "@/services/fineService";

export const usePayFine = () => {
  const paymentMutation = useMutation({
    mutationFn: (fineId: string) => FineService.pay(fineId),

    onSuccess: (response) => {
      const checkoutUrl = response.data?.checkoutUrl;

      if (!checkoutUrl) {
        showToast.error("No se pudo obtener el enlace de pago.");
        return;
      }

      showToast.success("Redirigiendo a Stripe para completar el pago...");

      window.location.assign(checkoutUrl);
    },

    onError: (error) => {
      showToast.apiError(error);
    },
  });

  return {
    payFine: paymentMutation.mutate,
    isPaying: paymentMutation.isPending,
    payingFineId: paymentMutation.variables,
  };
};

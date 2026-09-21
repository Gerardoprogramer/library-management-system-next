import { useMutation } from "@tanstack/react-query";

import { showToast } from "@/lib/toast-utils";
import { FineService } from "@/services/fineService";

export const usePayFine = () => {
  const paymentMutation = useMutation({
    mutationFn: (fineId: string) => FineService.pay(fineId),

    onSuccess: (payment) => {
      if (!payment.checkoutUrl) {
        showToast.error("No se pudo iniciar el pago", "No fue posible obtener el enlace de Stripe.");

        return;
      }

      showToast.success("Pago iniciado", "Te estamos redirigiendo a Stripe.");

      window.location.assign(payment.checkoutUrl);
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

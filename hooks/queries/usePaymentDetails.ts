import { useQuery } from "@tanstack/react-query";

import type { PaymentDetails } from "@/lib/definitions";
import { PaymentService } from "@/services/paymentService";

export const usePaymentDetails = (sessionId: string | null) => {
  return useQuery<PaymentDetails>({
    queryKey: ["payment-details", sessionId],

    queryFn: () => {
      if (!sessionId) {
        throw new Error("El identificador de la sesión de pago es requerido");
      }

      return PaymentService.getSuccessDetails(sessionId);
    },

    enabled: Boolean(sessionId),

    retry: 2,

    refetchInterval: (query) => {
      const status = query.state.data?.status;

      return status === "PENDING" ? 1500 : false;
    },

    staleTime: 1000 * 60 * 10,
  });
};

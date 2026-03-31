import { useQuery } from "@tanstack/react-query";
import { PaymentService } from "@/services/paymentService";
import type { PaymentDetails } from "@/lib/definitions";

export const usePaymentDetails = (sessionId: string | null) => {
    return useQuery<PaymentDetails>({
        queryKey: ["payment-details", sessionId],
        queryFn: () => {
            if (!sessionId) throw new Error("Session ID is required");
            return PaymentService.getSuccessDetails(sessionId);
        },
        enabled: !!sessionId,
        staleTime: 1000 * 60 * 10,
    });
};
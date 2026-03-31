import { api } from "@/lib/axios";
import type { ApiResponse, PaymentDetails } from "@/lib/definitions";

export const PaymentService = {
    getSuccessDetails: async (sessionId: string): Promise<PaymentDetails> => {
        const response = await api.get<ApiResponse<PaymentDetails>>(
            `/payment/${sessionId}`
        );

        if (!response.data.data) {
            throw new Error("No se pudo recuperar la información del pago.");
        }

        return response.data.data;
    },
};
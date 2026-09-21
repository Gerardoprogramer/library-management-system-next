import { api } from "@/lib/axios";
import type { ApiResponse, PageResponse, Payment, PaymentDetails } from "@/lib/definitions";

export const PaymentService = {
  getSuccessDetails: async (sessionId: string): Promise<PaymentDetails> => {
    const response = await api.get<ApiResponse<PaymentDetails>>(`/payment/${sessionId}`);

    if (!response.data.data) {
      throw new Error("No se pudo recuperar la información del pago.");
    }

    return response.data.data;
  },

  getHistory: async (page = 0): Promise<PageResponse<Payment>> => {
    const response = await api.get<ApiResponse<PageResponse<Payment>>>("/payment/history", {
      params: { page },
    });

    return (
      response.data.data ?? {
        content: [],
        number: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        first: true,
        empty: true,
      }
    );
  },
};

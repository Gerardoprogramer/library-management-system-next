import { api } from "@/lib/axios";
import type {
  ApiResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PageResponse,
  Payment,
  PaymentDetails,
  PaymentStatusDetails,
} from "@/lib/definitions";

export const PaymentService = {
  initiate: async (payment: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
    const response = await api.post<ApiResponse<InitiatePaymentResponse>>("/payment/initiate", payment);

    if (!response.data.data) {
      throw new Error(response.data.message || "No se pudo iniciar el pago");
    }

    return response.data.data;
  },

  getStatus: async (paymentId: string): Promise<PaymentStatusDetails> => {
    const response = await api.get<ApiResponse<PaymentStatusDetails>>(`/payment/${paymentId}/status`);

    if (!response.data.data) {
      throw new Error(response.data.message || "No se pudo obtener el estado del pago");
    }

    return response.data.data;
  },

  getById: async (paymentId: string): Promise<Payment> => {
    const response = await api.get<ApiResponse<Payment>>(`/payment/${paymentId}/details`);

    if (!response.data.data) {
      throw new Error(response.data.message || "No se pudo obtener el pago");
    }

    return response.data.data;
  },

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

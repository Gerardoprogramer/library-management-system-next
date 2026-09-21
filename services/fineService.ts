import { api } from "@/lib/axios";
import type { ApiResponse, Fine, FineStatus, FineType, InitiatePaymentResponse, PageResponse } from "@/lib/definitions";

export const FineService = {
  getMyFines: async (status?: FineStatus, type?: FineType, page = 0): Promise<PageResponse<Fine>> => {
    const response = await api.get<ApiResponse<PageResponse<Fine>>>("/fines/me", {
      params: {
        status,
        type,
        page,
      },
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

  pay: async (fineId: string): Promise<InitiatePaymentResponse> => {
    const response = await api.post<ApiResponse<InitiatePaymentResponse>>(`/fines/${fineId}/pay`);

    if (!response.data.data) {
      throw new Error(response.data.message || "No se pudo iniciar el pago de la multa");
    }

    return response.data.data;
  },
};

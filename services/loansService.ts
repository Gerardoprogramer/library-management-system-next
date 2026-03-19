import { api } from "@/lib/axios";
import type { ApiResponse, meLoans, PageResponse } from "@/lib/definitions";

export const loansService = {
    getBookLoans: async (status?: string, page?: number) => {
        const response = await api.get<ApiResponse<PageResponse<meLoans>>>(`/loans/me`
            ,
            {
                params: { status, page }
            }
        );
        return response.data.data;
    },
}
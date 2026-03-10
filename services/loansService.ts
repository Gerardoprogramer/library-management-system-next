import { api } from "@/lib/axios";
import type { ApiResponse, meLoans, PageResponse, statusLoan } from "@/lib/definitions";

export const loansService = {
    getBookReviews: async (status?: statusLoan, page?: number) => {
        const response = await api.get<ApiResponse<PageResponse<meLoans>>>(`/loans/me`
            ,
            {
                params: { status, page: page }
            }
        );
        return response.data.data;
    },
}
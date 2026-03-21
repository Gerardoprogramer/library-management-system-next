import { api } from "@/lib/axios";
import type { ApiResponse, meLoans, PageResponse } from "@/lib/definitions";

export const loansService = {

    getBookLoans: async (status?: string, page: number = 0): Promise<PageResponse<meLoans>> => {
        const response = await api.get<ApiResponse<PageResponse<meLoans>>>(`/loans/me`, {
            params: { status, page }
        });

        return response.data.data ?? {
            content: [],
            number: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            first: true,
            empty: true
        };
    },
};
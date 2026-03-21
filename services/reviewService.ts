import { api } from "@/lib/axios";
import type { ApiResponse, Review, PageResponse } from "@/lib/definitions";

export const reviewService = {

    getBookReviews: async (bookId: string, page: number = 0): Promise<PageResponse<Review>> => {
        const response = await api.get<ApiResponse<PageResponse<Review>>>(`/reviews/${bookId}`, {
            params: { page }
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
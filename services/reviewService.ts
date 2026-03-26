import { api } from "@/lib/axios";
import type { ApiResponse, Review, PageResponse, editReview } from "@/lib/definitions";

export const reviewService = {

    getBookReviews: async (id: string, page: number = 0): Promise<PageResponse<Review>> => {
        const response = await api.get<ApiResponse<PageResponse<Review>>>(`/reviews/${id}`, {
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

    editReview: async (review: editReview, id: string): Promise<ApiResponse<void>> => {
        const response = await api.put<ApiResponse<void>>(`/reviews/${id}`, review);

        return response.data;
    }
};
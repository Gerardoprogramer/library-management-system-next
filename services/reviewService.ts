import { api } from "@/lib/axios";
import type { ApiResponse, Review, PageResponse } from "@/lib/definitions";

export const reviewService = {
    getBookReviews: async (bookId: string, page?: number) => {
        const response = await api.get<ApiResponse<PageResponse<Review>>>(`/reviews/${bookId}`
            ,
            {
                params: { page: page }
            }
        );
        return response.data.data;
    },
}
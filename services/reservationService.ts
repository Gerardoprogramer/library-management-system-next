import { api } from "@/lib/axios";
import { ApiResponse, PageResponse, reservationBook } from "@/lib/definitions";

export const reservationService = {

    getReservations: async (
        bookid?: string,
        status?: string,
        activeOnly?: boolean,
        page: number = 0
    ): Promise<PageResponse<reservationBook>> => {

        const response = await api.get<ApiResponse<PageResponse<reservationBook>>>(
            `/reservation/me`,
            {
                params: { bookid, status, activeOnly, page }
            }
        );

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
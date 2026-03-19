import { api } from "@/lib/axios";
import { ApiResponse, PageResponse, reservationBook } from "@/lib/definitions";

export const reservationService = {
    getReservations: async (bookid?: string, status?: string, activeOnly?: boolean, page?: number) => {
        const response = await api.get<ApiResponse<PageResponse<reservationBook>>>(`/reservation/me`
            ,
            {
                params: { bookid, status, activeOnly, page }
            }
        );
        return response.data.data;
    },
}
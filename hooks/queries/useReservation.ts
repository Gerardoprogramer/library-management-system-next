
import { reservationService } from "@/services/reservationService";
import { useQuery } from "@tanstack/react-query";
import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import { PageResponse, reservationBook } from "@/lib/definitions";

export const useReservation = () => {

    const { get, set } = useUrlFilters();
    const status = get("status", "all");
    const availableOnly = get("availableOnly") === "true";
    const page = Number(get("ReservationPage", "1"));

    const { data: reservations } = useQuery<PageResponse<reservationBook>>({
        queryKey: ["reservations", { status, availableOnly, page }],
        queryFn: () =>
            reservationService.getReservations(
                undefined,
                status === "all" ? undefined : status,
                availableOnly,
                page - 1
            ),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
    });

    const setStatus = (s: string) => {
        set({
            status: s,
            ReservationPage: "1",
        })
    }

    const toggleAvailableOnly = () =>
        set({
            availableOnly: !availableOnly,
            ReservationPage: "1",
        })

    return {
        reservations,
        setStatus,
        status,
        toggleAvailableOnly,
        availableOnly
    }
}

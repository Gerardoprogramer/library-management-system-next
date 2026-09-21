import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { PageResponse, reservationBook } from "@/lib/definitions";
import { reservationService } from "@/services/reservationService";

export const useReservation = () => {
  const { get, set } = useUrlFilters();

  const status = get("status", "all");
  const activeOnly = get("activeOnly") === "true";
  const page = Number(get("ReservationPage", "1"));

  const { data: reservations, isLoading } = useQuery<PageResponse<reservationBook>>({
    queryKey: [
      "reservations",
      {
        status,
        activeOnly,
        page,
      },
    ],

    queryFn: () =>
      reservationService.getReservations(undefined, status === "all" ? undefined : status, activeOnly, page - 1),

    placeholderData: (previous) => previous,
    staleTime: 1000 * 60 * 5,
  });

  const setStatus = (newStatus: string) => {
    set({
      status: newStatus,
      ReservationPage: "1",
    });
  };

  const toggleActiveOnly = () => {
    set({
      activeOnly: !activeOnly,
      ReservationPage: "1",
    });
  };

  return {
    reservations,
    status,
    activeOnly,
    isLoading,
    setStatus,
    toggleActiveOnly,
  };
};

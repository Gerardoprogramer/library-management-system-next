import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { PageResponse, reservationBook } from "@/lib/definitions";
import { reservationService } from "@/services/reservationService";

const parsePage = (value: string) => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

export const useReservation = () => {
  const { get, set } = useUrlFilters();

  const status = get("status", "all");
  const activeOnly = get("activeOnly") === "true";

  const rawPage = get("ReservationPage", "1");

  const page = parsePage(rawPage);

  const {
    data: reservations,
    isLoading,
    isPlaceholderData,
  } = useQuery<PageResponse<reservationBook>>({
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

  useEffect(() => {
    if (rawPage !== String(page)) {
      set({
        ReservationPage: page === 1 ? undefined : String(page),
      });
    }
  }, [page, rawPage, set]);

  useEffect(() => {
    if (!reservations || isPlaceholderData) {
      return;
    }

    if (reservations.totalPages === 0 && page !== 1) {
      set({
        ReservationPage: undefined,
      });

      return;
    }

    if (reservations.totalPages > 0 && page > reservations.totalPages) {
      set({
        ReservationPage: String(reservations.totalPages),
      });
    }
  }, [isPlaceholderData, page, reservations, set]);

  const setStatus = (newStatus: string) => {
    set({
      status: newStatus,
      ReservationPage: undefined,
    });
  };

  const toggleActiveOnly = () => {
    set({
      activeOnly: !activeOnly,
      ReservationPage: undefined,
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

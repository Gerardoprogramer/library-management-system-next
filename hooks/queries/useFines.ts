import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { Fine, FineStatus, FineType, PageResponse } from "@/lib/definitions";
import { FineService } from "@/services/fineService";

const parsePage = (value: string) => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

export const useFines = () => {
  const { get, set } = useUrlFilters();

  const status = get("fineStatus", "all");
  const type = get("fineType", "all");

  const rawPage = get("FinePage", "1");
  const page = parsePage(rawPage);

  const query = useQuery<PageResponse<Fine>>({
    queryKey: [
      "fines",
      {
        status,
        type,
        page,
      },
    ],

    queryFn: () =>
      FineService.getMyFines(
        status === "all" ? undefined : (status as FineStatus),
        type === "all" ? undefined : (type as FineType),
        page - 1
      ),

    placeholderData: (previous) => previous,

    staleTime: 1000 * 60 * 5,
  });

  const { data: fines, isLoading, isPlaceholderData } = query;

  useEffect(() => {
    if (rawPage !== String(page)) {
      set({
        FinePage: page === 1 ? undefined : String(page),
      });
    }
  }, [page, rawPage, set]);

  useEffect(() => {
    if (!fines || isPlaceholderData) {
      return;
    }

    if (fines.totalPages === 0 && page !== 1) {
      set({
        FinePage: undefined,
      });

      return;
    }

    if (fines.totalPages > 0 && page > fines.totalPages) {
      set({
        FinePage: String(fines.totalPages),
      });
    }
  }, [fines, isPlaceholderData, page, set]);

  const setStatus = (newStatus: string) => {
    set({
      fineStatus: newStatus,
      FinePage: undefined,
    });
  };

  const setType = (newType: string) => {
    set({
      fineType: newType,
      FinePage: undefined,
    });
  };

  return {
    fines,
    status,
    type,
    page,
    isLoading,
    setStatus,
    setType,
  };
};

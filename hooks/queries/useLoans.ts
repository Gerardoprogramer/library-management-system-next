import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { PageResponse, meLoans } from "@/lib/definitions";
import { loansService } from "@/services/loansService";

const parsePage = (value: string) => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

export const useLoans = () => {
  const { get, set } = useUrlFilters();

  const rawPage = get("PageLoans", "1");
  const page = parsePage(rawPage);

  const status = get("status", "all");

  const {
    data: loans,
    isLoading,
    isPlaceholderData,
  } = useQuery<PageResponse<meLoans>>({
    queryKey: [
      "loans",
      {
        status,
        page,
      },
    ],

    queryFn: () => loansService.getBookLoans(status === "all" ? undefined : status, page - 1),

    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (rawPage !== String(page)) {
      set({
        PageLoans: page === 1 ? undefined : String(page),
      });
    }
  }, [page, rawPage, set]);

  useEffect(() => {
    if (!loans || isPlaceholderData) {
      return;
    }

    if (loans.totalPages === 0 && page !== 1) {
      set({
        PageLoans: undefined,
      });

      return;
    }

    if (loans.totalPages > 0 && page > loans.totalPages) {
      set({
        PageLoans: String(loans.totalPages),
      });
    }
  }, [isPlaceholderData, loans, page, set]);

  const setStatus = (status: string) => {
    set({
      status,
      PageLoans: undefined,
    });
  };

  return {
    isLoading,
    loans,
    status,
    page,
    setStatus,
  };
};

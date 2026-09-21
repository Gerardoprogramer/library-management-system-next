import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { Fine, FineStatus, FineType, PageResponse } from "@/lib/definitions";
import { FineService } from "@/services/fineService";

export const useFines = () => {
  const { get, set } = useUrlFilters();

  const status = get("fineStatus", "all");
  const type = get("fineType", "all");
  const page = Number(get("FinePage", "1"));

  const { data: fines, isLoading } = useQuery<PageResponse<Fine>>({
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

  const setStatus = (newStatus: string) => {
    set({
      fineStatus: newStatus,
      FinePage: "1",
    });
  };

  const setType = (newType: string) => {
    set({
      fineType: newType,
      FinePage: "1",
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

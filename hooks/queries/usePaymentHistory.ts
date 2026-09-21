import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { PageResponse, Payment } from "@/lib/definitions";
import { PaymentService } from "@/services/paymentService";

const parsePage = (value: string) => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

export const usePaymentHistory = () => {
  const { get, set } = useUrlFilters();

  const rawPage = get("PaymentPage", "1");
  const page = parsePage(rawPage);

  const query = useQuery<PageResponse<Payment>>({
    queryKey: ["payments", "history", page],

    queryFn: () => PaymentService.getHistory(page - 1),

    placeholderData: (previous) => previous,

    staleTime: 1000 * 60 * 5,
  });

  const { data: payments, isLoading, isPlaceholderData } = query;

  useEffect(() => {
    if (rawPage !== String(page)) {
      set({
        PaymentPage: page === 1 ? undefined : String(page),
      });
    }
  }, [page, rawPage, set]);

  useEffect(() => {
    if (!payments || isPlaceholderData) {
      return;
    }

    if (payments.totalPages === 0 && page !== 1) {
      set({
        PaymentPage: undefined,
      });

      return;
    }

    if (payments.totalPages > 0 && page > payments.totalPages) {
      set({
        PaymentPage: String(payments.totalPages),
      });
    }
  }, [isPlaceholderData, page, payments, set]);

  return {
    payments,
    page,
    isLoading,
  };
};

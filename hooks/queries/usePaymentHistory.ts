import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { PageResponse, Payment } from "@/lib/definitions";
import { PaymentService } from "@/services/paymentService";

export const usePaymentHistory = () => {
  const { get } = useUrlFilters();

  const page = Number(get("PaymentPage", "1"));

  const { data: payments, isLoading } = useQuery<PageResponse<Payment>>({
    queryKey: ["payments", "history", page],

    queryFn: () => PaymentService.getHistory(page - 1),

    placeholderData: (previous) => previous,
    staleTime: 1000 * 60 * 5,
  });

  return {
    payments,
    page,
    isLoading,
  };
};

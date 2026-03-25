import { useQuery } from "@tanstack/react-query";
import { loansService } from "@/services/loansService";
import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { PageResponse, meLoans } from "@/lib/definitions";

export const useLoans = () => {
    const { get, set } = useUrlFilters();

    const page = Number(get("PageLoans", "1"));
    const status = get("status", "all");

    const { data: loans, isLoading } = useQuery<PageResponse<meLoans>>({
        queryKey: ["loans", { status, page }],
        queryFn: () => loansService.getBookLoans(
            status === "all" ? undefined : status,
            page - 1
        ),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
    });

    const setStatus = (s: string) => {
        set({
            status: s,
            PageLoans: "1",
        });
    };

    return {
        isLoading,
        loans,
        status,
        page,
        setStatus
    };
};
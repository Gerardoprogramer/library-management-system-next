import { loansService } from "@/services/loansService";
import { useQuery } from "@tanstack/react-query";
import { useUrlFilters } from "./useUrlFilters";

export const useLoans = () => {

    const { get, set } = useUrlFilters();
    const page = Number(get("PageLoans", "1"));
    const status = get("status", "all");

    const { data: loans, isLoading } = useQuery({
        queryKey: ["loans", status, page],
        queryFn: () => loansService.getBookReviews(
            status === "all" ? undefined : status,
            page - 1
        ),
        staleTime: 1000 * 60 * 5,
    });

    const setStatus = (s: string) => {
        set({
            status: s,
            CatalogPage: "1",
        })
    }

    return {
        isLoading,
        loans,
        status,
        setStatus
    }
}

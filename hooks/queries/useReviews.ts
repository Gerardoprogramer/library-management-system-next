import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { reviewService } from "@/services/reviewService";
import type { PageResponse, Review } from "@/lib/definitions";
import type { ReviewType } from "@/lib/definitions";

export const useReviews = (target: ReviewType) => {
  const searchParams = useSearchParams();
  const queryPage = Number(searchParams.get("ReviewPage") ?? "1");
  const pageIndex = isNaN(+queryPage) ? 0 : +queryPage - 1;

  return useQuery<PageResponse<Review>>({
    queryKey: ["reviews", target, queryPage],
    queryFn: async () => {

      if (target.type === "book") {
        return await reviewService.getBookReviews(target.id, pageIndex);
      }

      /*       if (target.type === "mine") {
              return await reviewService.getUserReviews(pageIndex);
            } */

      throw new Error("Tipo de reseña no soportado");
    },

    enabled: target.type === "mine" || (target.type === "book" && !!target.id),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
};
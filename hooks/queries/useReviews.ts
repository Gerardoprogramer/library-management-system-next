import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { PageResponse, Review, ReviewType } from "@/lib/definitions";
import { reviewService } from "@/services/reviewService";

const parsePage = (value: string) => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

export const useReviews = (target: ReviewType) => {
  const { get, set } = useUrlFilters();

  const rawPage = get("ReviewPage", "1");
  const page = parsePage(rawPage);
  const pageIndex = page - 1;

  const query = useQuery<PageResponse<Review>>({
    queryKey: target.type === "book" ? ["reviews", "book", target.id, page] : ["reviews", "mine", page],

    queryFn: () => {
      if (target.type === "book") {
        return reviewService.getBookReviews(target.id, pageIndex);
      }

      return reviewService.getMeReviews(pageIndex);
    },

    enabled: target.type === "mine" || (target.type === "book" && Boolean(target.id)),

    placeholderData: (previous) => previous,

    staleTime: 1000 * 60 * 5,
  });

  const { data: reviews, isPlaceholderData } = query;

  useEffect(() => {
    if (rawPage !== String(page)) {
      set({
        ReviewPage: page === 1 ? undefined : String(page),
      });
    }
  }, [page, rawPage, set]);

  useEffect(() => {
    if (!reviews || isPlaceholderData) {
      return;
    }

    if (reviews.totalPages === 0 && page !== 1) {
      set({
        ReviewPage: undefined,
      });

      return;
    }

    if (reviews.totalPages > 0 && page > reviews.totalPages) {
      set({
        ReviewPage: String(reviews.totalPages),
      });
    }
  }, [isPlaceholderData, page, reviews, set]);

  return query;
};

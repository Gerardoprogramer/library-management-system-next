import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";
import type { PageResponse, myWishlist } from "@/lib/definitions";
import { WishListService } from "@/services/wishlistService";

const parsePage = (value: string) => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

export const useWishlist = () => {
  const { get, set } = useUrlFilters();

  const rawPage = get("wishlistPage", "1");
  const page = parsePage(rawPage);

  const query = useQuery<PageResponse<myWishlist>>({
    queryKey: ["wishlist", page],

    queryFn: () => WishListService.getMyWishlist(page - 1),

    placeholderData: (previous) => previous,

    staleTime: 1000 * 60 * 5,
  });

  const { data: wishlist, isPlaceholderData } = query;

  useEffect(() => {
    if (rawPage !== String(page)) {
      set({
        wishlistPage: page === 1 ? undefined : String(page),
      });
    }
  }, [page, rawPage, set]);

  useEffect(() => {
    if (!wishlist || isPlaceholderData) {
      return;
    }

    if (wishlist.totalPages === 0 && page !== 1) {
      set({
        wishlistPage: undefined,
      });

      return;
    }

    if (wishlist.totalPages > 0 && page > wishlist.totalPages) {
      set({
        wishlistPage: String(wishlist.totalPages),
      });
    }
  }, [isPlaceholderData, page, set, wishlist]);

  return query;
};

import type { PageResponse, myWishlist } from "@/lib/definitions";
import { WishListService } from "@/services/wishlistService";
import { useQuery } from "@tanstack/react-query";
import { useUrlFilters } from "@/hooks/Utilidades/useUrlFilters";

export const useWishlist = () => {
    const { get } = useUrlFilters();
    const page = Number(get("wishlistPage", "1"));

    return useQuery<PageResponse<myWishlist>>({
        queryKey: ["wishlist", page],
        queryFn: () => WishListService.getMyWishlist(page - 1),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
    });
};
'use client'

import { Heart } from "lucide-react";

import { WishListService } from "@/services/wishlistService";
import { useQuery } from "@tanstack/react-query";
import { WishlistCard } from "@/components/cards/WishlistCard";
import { myWishlist, PageResponse } from "@/lib/definitions";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useUrlFilters } from "@/hooks/useUrlFilters";

export default function WishlistPage() {
  const { get } = useUrlFilters();
  const page = Number(get("wishlistPage", "1"));

  const { data: wishlist } = useQuery<PageResponse<myWishlist>>({
    queryKey: ["wishlist", page],
    queryFn: () => WishListService.getMyWishlist(page - 1),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });


  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Heart className="w-7 h-7 text-primary" />
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">Mi Lista de Deseos</h1>
      </div>
      <p className="font-body text-lg text-muted-foreground mb-8">{wishlist?.totalElements} libros guardados</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist?.content.map((wish) => (
          <WishlistCard key={wish.id} data={wish} />
        ))}
      </div>
      {wishlist && wishlist?.totalPages > 1 && (
        <div className="px-4 mt-6">
          <CustomPagination totalPages={wishlist?.totalPages} paramName="wishlistPage" />
        </div>
      )}
    </div>
  )
}
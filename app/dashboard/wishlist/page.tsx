'use client'

import { WishListService } from "@/services/wishlistService";
import { useQuery } from "@tanstack/react-query";

export default function WishlistPage() {

  const { data } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => WishListService.getMyWishlist(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  console.log("YHolaaaaaaaaaaaaaaaaaaaaaaaaaa  "+data)

  return <div>Lista de Deseos</div>;
}
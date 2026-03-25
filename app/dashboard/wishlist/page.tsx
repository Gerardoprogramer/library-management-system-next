'use client'

import { Heart } from "lucide-react";
import { WishlistCard } from "@/components/cards/WishlistCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useWishlist } from "@/hooks/queries/useWishlist";
import { useWishlistActions } from "@/hooks/mutations/useWishlistActions";
import { useDebouncedCallback } from "@/hooks/Utilidades/useDebouncedCallback";
import { WishlistPageSkeleton } from "@/components/custom/skeletons";

export default function WishlistPage() {

  const { data: wishlist, isLoading } = useWishlist();
  const { mutate: handleWishlistToggle } = useWishlistActions();

  const debouncedToggle = useDebouncedCallback(
    (bookId: string, isInWishlist: boolean) => {
      handleWishlistToggle({ bookId, isInWishlist });
    },
    300
  );

  if (isLoading) return <WishlistPageSkeleton />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Heart className="w-7 h-7 text-primary" />
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">Mi Lista de Deseos</h1>
      </div>
      <p className="font-body text-lg text-muted-foreground mb-8">{wishlist?.totalElements} libros guardados</p>

      {wishlist?.totalElements === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 w-full">
          <p className="font-body text-muted-foreground text-center">
            No tienes libros en la lista de deseos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist?.content.map((wish) => (
            <WishlistCard
              key={wish.id}
              data={wish}
              handleWishlistToggle={debouncedToggle}
            />
          ))}
        </div>
      )}
      {wishlist && wishlist?.totalPages > 1 && (
        <div className="px-4 mt-6">
          <CustomPagination totalPages={wishlist?.totalPages} paramName="wishlistPage" />
        </div>
      )}
    </div>
  )
}
"use client";

import { PiHeart, PiHeartBreak } from "react-icons/pi";

import { WishlistCard } from "@/components/cards/WishlistCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { WishlistPageSkeleton } from "@/components/custom/skeletons";
import { useWishlistActions } from "@/hooks/mutations/useWishlistActions";
import { useWishlist } from "@/hooks/queries/useWishlist";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();

  const wishlistMutation = useWishlistActions();

  if (isLoading) {
    return <WishlistPageSkeleton />;
  }

  const totalElements = wishlist?.totalElements ?? 0;

  const handleWishlistToggle = (bookId: string, isInWishlist: boolean, onSuccess?: () => void) => {
    wishlistMutation.mutate(
      {
        bookId,
        isInWishlist,
      },
      {
        onSuccess,
      }
    );
  };

  return (
    <div className="space-y-6">
      <section className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiHeart className="size-4.5" />
          </div>

          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Biblioteca personal
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Mi lista de deseos</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Guardá libros que te interesan y consultá cuándo vuelven a estar disponibles.
        </p>
      </section>

      <div className="border-y border-border/60 py-3">
        <p className="text-sm text-muted-foreground">
          {totalElements === 0
            ? "Sin libros guardados"
            : totalElements === 1
              ? "1 libro guardado"
              : `${totalElements} libros guardados`}
        </p>
      </div>

      {totalElements === 0 ? (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <PiHeartBreak className="size-6" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-foreground">Tu lista está vacía</h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Cuando encontrés un libro que te interese, podés guardarlo para consultarlo más adelante.
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wishlist?.content.map((wish) => (
            <WishlistCard
              key={wish.id}
              data={wish}
              handleWishlistToggle={handleWishlistToggle}
              isPending={wishlistMutation.isPending}
            />
          ))}
        </section>
      )}

      {wishlist && wishlist.totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <CustomPagination totalPages={wishlist.totalPages} paramName="wishlistPage" />
        </div>
      )}
    </div>
  );
}

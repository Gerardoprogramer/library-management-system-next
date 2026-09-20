import Image from "next/image";
import { PiBookmarkSimple, PiBookOpenText, PiHeart, PiHeartFill, PiInfo } from "react-icons/pi";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "@/hooks/Utilidades/useDebouncedCallback";
import { useWishlistActions } from "@/hooks/mutations/useWishlistActions";

interface BookSideProps {
  book: {
    id: string;
    title: string;
    coverImageUrl: string;
    availableCopies: number;
    isWishList: boolean;
  };
  setCheckoutDialogOpen: (open: boolean) => void;
  setReserveDialogOpen: (open: boolean) => void;
  hasSub: boolean;
  hasRes: boolean;
  hasLoan: boolean;
}

export const BookSide = ({
  book,
  setCheckoutDialogOpen,
  setReserveDialogOpen,
  hasRes,
  hasSub,
  hasLoan,
}: BookSideProps) => {
  const { mutate: toggleWishlist } = useWishlistActions();

  const debouncedToggle = useDebouncedCallback((bookId: string, isInWishlist: boolean) => {
    toggleWishlist({ bookId, isInWishlist });
  }, 300);

  const isAvailable = book.availableCopies > 0;

  return (
    <aside className="lg:col-span-1">
      <div className="space-y-4 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm">
          <div className="relative aspect-3/4">
            <Image
              src={book.coverImageUrl}
              alt={`Portada de ${book.title}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Disponibilidad</p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {isAvailable
                  ? `${book.availableCopies} ${book.availableCopies === 1 ? "copia disponible" : "copias disponibles"}`
                  : "Sin copias disponibles"}
              </p>
            </div>

            <div
              className={`size-2.5 rounded-full ${isAvailable ? "bg-primary" : "bg-destructive"}`}
              aria-hidden="true"
            />
          </div>

          <div className="flex gap-2">
            {isAvailable || hasLoan ? (
              <Button
                className="h-11 flex-1 gap-2 rounded-xl"
                disabled={!hasSub || hasLoan}
                onClick={() => setCheckoutDialogOpen(true)}
              >
                <PiBookOpenText className="size-4.5" />

                {hasLoan ? "Préstamo activo" : "Solicitar préstamo"}
              </Button>
            ) : (
              <Button
                className="h-11 flex-1 gap-2 rounded-xl"
                variant="secondary"
                disabled={!hasSub || hasRes}
                onClick={() => setReserveDialogOpen(true)}
              >
                <PiBookmarkSimple className="size-4.5" />

                {hasRes ? "Reserva activa" : "Reservar"}
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 shrink-0 rounded-xl"
              aria-label={
                book.isWishList ? `Eliminar ${book.title} de la wishlist` : `Agregar ${book.title} a la wishlist`
              }
              onClick={() => debouncedToggle(book.id, book.isWishList)}
            >
              {book.isWishList ? (
                <PiHeartFill className="size-4.75 text-destructive" />
              ) : (
                <PiHeart className="size-4.75" />
              )}
            </Button>
          </div>
        </div>

        {!hasSub && (
          <Alert className="rounded-xl border-primary/20 bg-primary/5">
            <PiInfo className="size-4 text-primary" />

            <AlertDescription className="text-sm leading-5 text-muted-foreground">
              Necesitás una suscripción activa para solicitar préstamos o realizar reservas.
            </AlertDescription>
          </Alert>
        )}

        {hasLoan && (
          <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-3">
            <p className="text-sm text-muted-foreground">Ya tenés un préstamo activo de este libro.</p>
          </div>
        )}

        {hasRes && !isAvailable && (
          <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-3">
            <p className="text-sm text-muted-foreground">Ya tenés una reserva activa para este libro.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

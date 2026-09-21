"use client";

import { PiChatTeardropText, PiStar } from "react-icons/pi";

import { MeReviewCard } from "@/components/cards/MeReviewCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useReviews } from "@/hooks/queries/useReviews";

export default function ReviewPage() {
  const { data: reviews, isLoading } = useReviews({
    type: "mine",
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  const totalElements = reviews?.totalElements ?? 0;

  return (
    <div className="space-y-6">
      <section className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiStar className="size-4.5" />
          </div>

          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Biblioteca personal
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Mis reseñas</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Revisá, editá o eliminá las opiniones que publicaste sobre tus lecturas.
        </p>
      </section>

      <div className="border-y border-border/60 py-3">
        <p className="text-sm text-muted-foreground">
          {totalElements === 0
            ? "Sin reseñas publicadas"
            : totalElements === 1
              ? "1 reseña publicada"
              : `${totalElements} reseñas publicadas`}
        </p>
      </div>

      {totalElements === 0 ? (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <PiChatTeardropText className="size-6" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-foreground">Todavía no publicaste reseñas</h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Después de leer un libro podés compartir tu opinión desde su página de detalle.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {reviews?.content.map((review) => (
            <MeReviewCard key={review.id} review={review} />
          ))}
        </section>
      )}

      {reviews && reviews.totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <CustomPagination totalPages={reviews.totalPages} paramName="ReviewPage" />
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { PiPlus, PiStar, PiUsersThree } from "react-icons/pi";

import { ReviewCard } from "@/components/cards/ReviewCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { ReviewListSkeleton } from "@/components/custom/skeletons";
import { ReviewFormDialog } from "@/components/dialog/ReviewFormDialog";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "@/hooks/mutations/useCreateReview";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { useReviews } from "@/hooks/queries/useReviews";

interface ReviewListProps {
  bookId: string;
  bookTitle: string;
  canCreate: boolean;
  alreadyReviewed: boolean;
}

export const ReviewList = ({ bookId, bookTitle, alreadyReviewed, canCreate }: ReviewListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: user } = useCurrentUser();
  const { data: reviews, isLoading } = useReviews({ type: "book", id: bookId });
  const { mutate: create, isPending } = useCreateReview({ type: "book", id: bookId });

  const handleSave = (formValues: { rating: number; title: string; reviewText: string }) => {
    create({
      bookId,
      rating: formValues.rating,
      title: formValues.title,
      reviewText: formValues.reviewText,
    });

    setDialogOpen(false);
  };

  if (isLoading) {
    return <ReviewListSkeleton />;
  }

  const totalElements = reviews?.totalElements ?? 0;
  const content = reviews?.content ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <PiUsersThree className="size-5 text-primary" />

            <h2 className="text-lg font-semibold tracking-tight text-foreground">Reseñas</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {totalElements === 0
              ? "Todavía no hay opiniones sobre este libro."
              : `${totalElements} ${totalElements === 1 ? "reseña publicada" : "reseñas publicadas"}`}
          </p>
        </div>

        {canCreate && (
          <Button type="button" onClick={() => setDialogOpen(true)} className="h-10 gap-2 rounded-xl">
            <PiPlus className="size-4.5" />
            Escribir reseña
          </Button>
        )}
      </div>

      {alreadyReviewed && !canCreate && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PiStar className="size-4.5" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Ya calificaste este libro</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Podés editar o eliminar tu reseña desde la tarjeta correspondiente.
            </p>
          </div>
        </div>
      )}

      {totalElements > 0 ? (
        <div className="space-y-3">
          {content.map((review) => (
            <ReviewCard key={review.id} review={review} userId={user?.id} bookTitle={bookTitle} bookId={bookId} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiStar className="size-6" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-foreground">Sé la primera persona en opinar</h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Las reseñas ayudan a otros lectores a conocer mejor este libro.
          </p>
        </div>
      )}

      {reviews && reviews.totalPages > 1 && (
        <div className="flex justify-center pt-3">
          <CustomPagination totalPages={reviews.totalPages} paramName="ReviewPage" />
        </div>
      )}

      {dialogOpen && (
        <ReviewFormDialog
          mode="create"
          bookTitle={bookTitle}
          handleSave={handleSave}
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          isPending={isPending}
        />
      )}
    </div>
  );
};

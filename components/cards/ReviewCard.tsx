import { useState } from "react";
import { PiClock, PiPencilSimple, PiStar, PiStarFill, PiTrash } from "react-icons/pi";

import { DeleteReviewDialog } from "@/components/dialog/DeleteReviewDialog";
import { ReviewFormDialog } from "@/components/dialog/ReviewFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteReview } from "@/hooks/mutations/useDeleteReviewActions";
import { useReviewActions } from "@/hooks/mutations/useReviewActions";
import type { Review } from "@/lib/definitions";
import { formatDate } from "@/lib/date-utils";

interface Props {
  review: Review;
  userId?: string;
  bookTitle: string;
  bookId: string;
}

export const ReviewCard = ({ review, userId, bookTitle, bookId }: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { performReview, isPending } = useReviewActions(review.id, { type: "book", id: bookId }, review.rating);

  const { deleteReview, isDeleting } = useDeleteReview(review.id, { type: "book", id: bookId }, review.rating);

  const isOwn = userId === review.userId;

  const handleSave = (formValues: { rating: number; title: string; reviewText: string }) => {
    performReview(formValues);
    setEditDialogOpen(false);
  };

  const handleDelete = () => {
    deleteReview();
    setDeleteDialogOpen(false);
  };

  return (
    <article className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{review.userName}</p>

            {isOwn && (
              <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[10px] font-medium">
                Tu reseña
              </Badge>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-0.5" aria-label={`${review.rating} de 5 estrellas`}>
              {Array.from({ length: 5 }).map((_, index) =>
                index < review.rating ? (
                  <PiStarFill key={index} className="size-4 text-primary" />
                ) : (
                  <PiStar key={index} className="size-4 text-muted-foreground/40" />
                )
              )}
            </div>

            <span className="text-xs font-medium text-muted-foreground">{review.rating}/5</span>
          </div>
        </div>

        {isOwn && (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Editar reseña"
              onClick={() => setEditDialogOpen(true)}
              className="size-9 rounded-lg"
            >
              <PiPencilSimple className="size-4.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Eliminar reseña"
              onClick={() => setDeleteDialogOpen(true)}
              className="size-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <PiTrash className="size-4.5" />
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4">
        {review.title && <h3 className="text-sm font-semibold leading-6 text-foreground">{review.title}</h3>}

        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">{review.reviewText}</p>
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <PiClock className="size-3.5" />
        <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
      </div>

      {editDialogOpen && (
        <ReviewFormDialog
          bookTitle={bookTitle}
          review={review}
          isOpen={editDialogOpen}
          setIsOpen={setEditDialogOpen}
          isPending={isPending}
          handleSave={handleSave}
          mode="edit"
        />
      )}

      {deleteDialogOpen && (
        <DeleteReviewDialog
          confirmDelete={handleDelete}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          isPending={isDeleting}
        />
      )}
    </article>
  );
};

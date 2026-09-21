"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiArrowRight, PiCalendarBlank, PiPencilSimple, PiStar, PiTrash } from "react-icons/pi";

import { DeleteReviewDialog } from "@/components/dialog/DeleteReviewDialog";
import { ReviewFormDialog } from "@/components/dialog/ReviewFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeleteReview } from "@/hooks/mutations/useDeleteReviewActions";
import { useReviewActions } from "@/hooks/mutations/useReviewActions";
import { useCurrentUrl } from "@/hooks/Utilidades/useCurrentUrl";
import { useQueryParams } from "@/hooks/Utilidades/useQueryParams";
import { formatDate } from "@/lib/date-utils";
import type { Review } from "@/lib/definitions";
import { createSlug } from "@/lib/slug-utils";

interface Props {
  review: Review;
}

export const MeReviewCard = ({ review }: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const currentUrl = useCurrentUrl();
  const queryParams = useQueryParams();

  const { performReview, isPending } = useReviewActions(review.id, { type: "mine" }, review.rating);

  const { deleteReview, isDeleting } = useDeleteReview(review.id, { type: "mine" }, review.rating);

  const bookHref = {
    pathname: `/dashboard/book/${createSlug(review.bookId, review.bookTitle)}`,
    query: {
      ...queryParams,
      from: currentUrl,
    },
  };

  const handleSave = (formValues: { rating: number; title: string; reviewText: string }) => {
    performReview(formValues, {
      onSuccess: () => {
        setEditDialogOpen(false);
      },
    });
  };

  const handleDelete = () => {
    deleteReview(undefined, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <Link
              href={bookHref}
              aria-label={`Ver ${review.bookTitle}`}
              className="group relative aspect-3/4 w-full shrink-0 overflow-hidden bg-muted sm:w-32 md:w-36"
            >
              <Image
                src={review.coverImageUrl}
                alt={`Portada de ${review.bookTitle}`}
                fill
                sizes="(max-width: 640px) 100vw, 144px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link href={bookHref} className="inline-block max-w-full">
                    <h3 className="line-clamp-2 text-base font-semibold leading-6 tracking-tight text-foreground transition-colors hover:text-primary sm:text-lg">
                      {review.bookTitle}
                    </h3>
                  </Link>

                  <div className="mt-2 flex items-center gap-1" aria-label={`${review.rating} de 5 estrellas`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <PiStar
                        key={index}
                        className={
                          index < review.rating ? "size-4 fill-current text-primary" : "size-4 text-muted-foreground/40"
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    aria-label={`Editar reseña de ${review.bookTitle}`}
                    onClick={() => setEditDialogOpen(true)}
                    className="size-8 p-0"
                  >
                    <PiPencilSimple />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    aria-label={`Eliminar reseña de ${review.bookTitle}`}
                    onClick={() => setDeleteDialogOpen(true)}
                    className="size-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <PiTrash />
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                {review.title && <p className="text-sm font-semibold text-foreground">{review.title}</p>}

                <p className="mt-1 text-sm leading-6 text-muted-foreground">{review.reviewText}</p>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <PiCalendarBlank className="size-4 shrink-0" />
                  <span>Publicada el {formatDate(review.createdAt)}</span>
                </div>

                <Button asChild variant="ghost" size="sm">
                  <Link href={bookHref}>
                    Ver libro
                    <PiArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editDialogOpen && (
        <ReviewFormDialog
          bookTitle={review.bookTitle}
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
    </>
  );
};

"use client";

import { useState } from "react";
import { PiStar } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReviewForm } from "@/hooks/ui/useReviewForm";
import type { Review } from "@/lib/definitions";
import { reviewSchema } from "@/schemas/review.schema";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bookTitle: string;
  review?: Review;
  handleSave: (formValues: { rating: number; title: string; reviewText: string }) => void;
  isPending: boolean;
  mode: "create" | "edit";
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating = ({ value, onChange }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Calificación">
      {Array.from({ length: 5 }).map((_, index) => {
        const rating = index + 1;
        const selected = rating <= value;

        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${rating} ${rating === 1 ? "estrella" : "estrellas"}`}
            onClick={() => onChange(rating)}
            className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PiStar
              className={
                selected
                  ? "size-6 fill-current text-primary"
                  : "size-6 text-muted-foreground/40 transition-colors hover:text-primary/60"
              }
            />
          </button>
        );
      })}
    </div>
  );
};

export const ReviewFormDialog = ({ isOpen, setIsOpen, bookTitle, handleSave, isPending, mode, review }: Props) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const { formRating, formText, formTitle, setFormRating, setFormText, setFormTitle } = useReviewForm(review);

  const config = {
    create: {
      title: "Escribir reseña",
      description: `Compartí tu opinión sobre «${bookTitle}».`,
      button: "Publicar reseña",
    },
    edit: {
      title: "Editar reseña",
      description: `Modificá tu reseña de «${bookTitle}».`,
      button: "Guardar cambios",
    },
  };

  const handleOpenChange = (open: boolean) => {
    if (isPending && !open) {
      return;
    }

    if (!open) {
      setValidationError(null);
    }

    setIsOpen(open);
  };

  const handleSubmit = () => {
    const result = reviewSchema.safeParse({
      title: formTitle.trim(),
      reviewText: formText.trim(),
      rating: formRating,
    });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "Revisá los datos ingresados.");
      return;
    }

    setValidationError(null);

    handleSave({
      rating: result.data.rating,
      title: result.data.title,
      reviewText: result.data.reviewText,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiStar className="size-5" />
          </div>

          <DialogTitle>{config[mode].title}</DialogTitle>

          <DialogDescription>{config[mode].description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Calificación</label>

            <StarRating value={formRating} onChange={setFormRating} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="review-title" className="text-sm font-medium text-foreground">
                Título <span className="font-normal text-muted-foreground">(opcional)</span>
              </label>

              <span className="text-xs text-muted-foreground">{formTitle.length}/255</span>
            </div>

            <Input
              id="review-title"
              value={formTitle}
              maxLength={255}
              onChange={(event) => setFormTitle(event.target.value)}
              placeholder="Ej: Una lectura imprescindible"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="review-text" className="text-sm font-medium text-foreground">
                Reseña
              </label>

              <span
                className={
                  formText.length >= 1900 ? "text-xs font-medium text-destructive" : "text-xs text-muted-foreground"
                }
              >
                {formText.length}/2000
              </span>
            </div>

            <Textarea
              id="review-text"
              value={formText}
              maxLength={2000}
              onChange={(event) => setFormText(event.target.value)}
              placeholder="¿Qué te pareció este libro?"
              className={validationError ? "min-h-32 resize-y border-destructive" : "min-h-32 resize-y"}
            />

            {validationError && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {validationError}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>

          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            <PiStar />

            {isPending ? "Procesando..." : config[mode].button}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { z } from "zod";

export const reviewSchema = z.object({
  title: z.string().max(255, "El título no puede superar los 255 caracteres"),

  reviewText: z
    .string()
    .min(10, "La reseña debe tener al menos 10 caracteres")
    .max(2000, "La reseña no puede exceder los 2000 caracteres"),

  rating: z.number().min(1, "Debes seleccionar al menos 1 estrella").max(5, "El máximo son 5 estrellas"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

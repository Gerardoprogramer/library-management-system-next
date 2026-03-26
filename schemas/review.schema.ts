import { z } from "zod";

export const reviewSchema = z.object({
    title: z
        .string()
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(100, "El título es demasiado largo (máximo 100)"),

    reviewText: z
        .string()
        .min(10, "La reseña debe ser más descriptiva")
        .max(255, "La reseña no puede exceder los 255 caracteres"),

    rating: z
        .number()
        .min(1, "Debes seleccionar al menos 1 estrella")
        .max(5, "El máximo son 5 estrellas"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
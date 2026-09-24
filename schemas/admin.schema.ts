import { z } from "zod";

const uuidSchema = (message: string) => z.string().trim().min(1, message).uuid(message);

const optionalDateSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z
    .string()
    .refine(
      (value) => {
        const date = new Date(`${value}T00:00:00`);
        const today = new Date();

        today.setHours(23, 59, 59, 999);

        return !Number.isNaN(date.getTime()) && date <= today;
      },
      {
        message: "La fecha de publicación no puede ser futura",
      }
    )
    .optional()
);

const nullableUuidSchema = z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().uuid("El identificador no es válido").nullable().optional()
);

export const adminBookCreateSchema = z.object({
  isbn: z
    .string()
    .trim()
    .min(1, "El ISBN es obligatorio")
    .min(10, "El ISBN debe tener entre 10 y 17 caracteres")
    .max(17, "El ISBN debe tener entre 10 y 17 caracteres")
    .regex(/^(97[89])?[\d-]{9,17}[\dX]$/, "El ISBN no tiene un formato válido"),

  title: z.string().trim().min(1, "El título es obligatorio").max(255, "El título no puede superar los 255 caracteres"),

  author: z.string().trim().min(1, "El autor es obligatorio"),

  genreId: uuidSchema("El género es obligatorio"),

  publisher: z.string().trim().max(255, "La editorial no puede superar los 255 caracteres").optional(),

  publishedDate: optionalDateSchema,

  language: z.string().trim().max(50, "El idioma no puede superar los 50 caracteres").optional(),

  pages: z
    .number()
    .int("El número de páginas debe ser entero")
    .min(1, "El número de páginas debe ser mayor a 0")
    .optional(),

  description: z.string().trim().max(500, "La descripción no puede superar los 500 caracteres").optional(),

  totalCopies: z.number().int("El total de copias debe ser entero").min(1, "El total de copias debe ser al menos 1"),

  price: z.number().min(0, "El precio no puede ser negativo").optional(),

  coverImageUrl: z.string().trim().max(255, "La URL de la portada no puede superar los 255 caracteres").optional(),
});

export const adminBookUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "El título es obligatorio")
    .max(255, "El título no puede superar los 255 caracteres")
    .optional(),

  author: z
    .string()
    .trim()
    .min(1, "El autor es obligatorio")
    .max(255, "El autor no puede superar los 255 caracteres")
    .optional(),

  genreId: z.string().uuid("El género no es válido").optional(),

  publisher: z.string().trim().max(255, "La editorial no puede superar los 255 caracteres").optional(),

  publishedDate: optionalDateSchema,

  language: z.string().trim().max(50, "El idioma no puede superar los 50 caracteres").optional(),

  pages: z
    .number()
    .int("El número de páginas debe ser entero")
    .min(1, "El número de páginas debe ser mayor a 0")
    .optional(),

  description: z.string().trim().max(500, "La descripción no puede superar los 500 caracteres").optional(),

  totalCopies: z
    .number()
    .int("El total de copias debe ser entero")
    .min(1, "El total de copias debe ser mayor a 0")
    .optional(),

  availableCopies: z
    .number()
    .int("Las copias disponibles deben ser un número entero")
    .min(0, "Las copias disponibles no pueden ser negativas")
    .optional(),

  price: z.number().min(0, "El precio no puede ser negativo").optional(),

  coverImageUrl: z.string().trim().max(255, "La URL de la portada no puede superar los 255 caracteres").optional(),

  active: z.boolean().optional(),
});

export const adminGenreSchema = z.object({
  code: z.string().trim().min(1, "El código del género es obligatorio"),

  name: z.string().trim().min(1, "El nombre del género es obligatorio"),

  description: z.string().trim().max(500, "La descripción no puede superar los 500 caracteres").optional(),

  displayOrder: z
    .number()
    .int("El orden debe ser un número entero")
    .min(0, "El orden de visualización no puede ser negativo")
    .optional(),

  active: z.boolean().optional(),

  parentGenreId: nullableUuidSchema,
});

export const adminFineSchema = z.object({
  userId: uuidSchema("El usuario es obligatorio"),

  bookLoanId: uuidSchema("El préstamo es obligatorio"),

  type: z.enum(["OVERDUE", "DAMAGE", "LOSS", "PROCESSING"], {
    message: "Selecciona un tipo de multa válido",
  }),

  amount: z
    .number()
    .positive("El monto debe ser mayor a 0")
    .max(99_999_999.99, "El monto es demasiado alto")
    .refine((value) => Number.isInteger(value * 100), "El monto puede tener como máximo 2 decimales"),

  currency: z.enum(["USD", "CRC", "EUR"], {
    message: "Selecciona una moneda válida",
  }),

  reason: z.string().trim().max(500, "La razón no puede superar 500 caracteres").optional(),

  notes: z.string().trim().max(1000, "Las notas no pueden superar 1000 caracteres").optional(),
});

export type AdminBookCreateData = z.infer<typeof adminBookCreateSchema>;
export type AdminBookUpdateData = z.infer<typeof adminBookUpdateSchema>;
export type AdminGenreData = z.infer<typeof adminGenreSchema>;
export type AdminFineData = z.infer<typeof adminFineSchema>;

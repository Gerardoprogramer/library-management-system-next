import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre es requerido"),

  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),

  password: z
    .string()
    .min(1, "La contraseña es requerida"),
});

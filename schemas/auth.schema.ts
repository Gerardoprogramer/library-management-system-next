import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "El correo electrónico es requerido")
  .email("Ingresá un correo electrónico válido");

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre completo es requerido"),

  email: emailSchema,

  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: emailSchema,

  password: z.string().min(1, "La contraseña es requerida"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

"use client";

import Link from "next/link";
import { PiEnvelopeSimple, PiSpinnerGap, PiUser } from "react-icons/pi";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/auth/useRegister";

export default function RegisterPage() {
  const { email, errors, fullName, handleSubmit, loading, password, setEmail, setFullName, setPassword } =
    useRegister();

  return (
    <>
      <AuthHeader
        eyebrow="Nueva cuenta"
        subtitle="Empezá tu recorrido lector."
        description="Crea tu cuenta para descubrir libros, reservar ejemplares y llevar tus préstamos."
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="full-name" className="text-sm font-medium text-foreground">
              Nombre completo
            </label>

            <div className="relative">
              <PiUser className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="full-name"
                type="text"
                autoComplete="name"
                placeholder="Tu nombre"
                className="pl-10"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "full-name-error" : undefined}
                required
              />
            </div>

            {errors.fullName && (
              <p id="full-name-error" role="alert" className="text-sm text-destructive">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="register-email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </label>

            <div className="relative">
              <PiEnvelopeSimple className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="pl-10"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "register-email-error" : undefined}
                required
              />
            </div>

            {errors.email && (
              <p id="register-email-error" role="alert" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <PasswordInput id="register-password" value={password} onChange={setPassword} />

            {errors.password && (
              <p role="alert" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <PiSpinnerGap className="animate-spin" />}

            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </AuthCard>
    </>
  );
}

"use client";

import Link from "next/link";
import { PiEnvelopeSimple, PiSpinnerGap } from "react-icons/pi";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, loading, errors, handleSubmit } = useLogin();

  return (
    <>
      <AuthHeader subtitle="Iniciá sesión para continuar a tu biblioteca." />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </label>

            <div className="relative">
              <PiEnvelopeSimple className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="pl-10"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
              />
            </div>

            {errors.email && (
              <p id="email-error" role="alert" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <PasswordInput id="login-password" value={password} onChange={setPassword} />

            {errors.password && (
              <p role="alert" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <PiSpinnerGap className="animate-spin" />}

            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Crear cuenta
            </Link>
          </p>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/auth/forgot-password" className="font-medium text-primary underline-offset-4 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </form>
      </AuthCard>
    </>
  );
}

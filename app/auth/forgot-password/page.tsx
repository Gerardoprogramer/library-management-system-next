"use client";

import Link from "next/link";
import { useState } from "react";
import { PiEnvelopeSimple, PiSpinnerGap } from "react-icons/pi";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast-utils";
import { authService } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSent(true);
      showToast.success("Solicitud enviada", "Revisa tu correo para continuar.");
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader subtitle="Recuperá el acceso a tu cuenta." />
      <AuthCard>
        {sent ? (
          <div className="space-y-5 text-center">
            <p className="text-sm leading-6 text-muted-foreground">
              Si existe una cuenta asociada al correo indicado, recibirás un enlace para restablecer la contraseña.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Volver a iniciar sesión</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="forgot-email" className="text-sm font-medium">Correo electrónico</label>
              <div className="relative">
                <PiEnvelopeSimple className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <PiSpinnerGap className="animate-spin" />}
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Volver a iniciar sesión
              </Link>
            </p>
          </form>
        )}
      </AuthCard>
    </>
  );
}

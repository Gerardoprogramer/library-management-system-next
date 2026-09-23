"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PiSpinnerGap } from "react-icons/pi";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";
import { authService } from "@/services/authService";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await authService.resetPassword({ token, password });
      setCompleted(true);
      showToast.success("Contraseña actualizada", "Ya puedes iniciar sesión.");
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader subtitle="Elegí una nueva contraseña para tu cuenta." />
      <AuthCard>
        {completed ? (
          <div className="space-y-5 text-center">
            <p className="text-sm text-muted-foreground">Tu contraseña fue actualizada correctamente.</p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="reset-token" className="text-sm font-medium">
                Token de recuperación
              </label>
              <input
                id="reset-token"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
              />
            </div>
            <PasswordInput id="reset-password" label="Nueva contraseña" value={password} onChange={setPassword} />
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <PiSpinnerGap className="animate-spin" />}
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </form>
        )}
      </AuthCard>
    </>
  );
}

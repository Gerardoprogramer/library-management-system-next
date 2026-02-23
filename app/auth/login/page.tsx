"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {

  const { email, setEmail, password,
    setPassword, loading, errors, handleSubmit } = useLogin();

  return (
    <>
      <AuthHeader subtitle="Bienvenido de vuelta" />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="font-body text-sm text-foreground">
              Correo electrónico
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tu@email.com"
                className="pl-10 font-body"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
          </div>

          <PasswordInput value={password} onChange={setPassword} />
          {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password}</p>)}
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-display tracking-wider uppercase text-sm"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </Button>

          <p className="font-body text-sm text-center text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register">
              <span className="text-primary hover:underline font-medium cursor-pointer">
                Regístrate
              </span>
            </Link>
          </p>
        </form>
      </AuthCard>
    </>
  );
}
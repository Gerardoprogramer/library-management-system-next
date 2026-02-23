'use client';

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterPage() {

  const { fullName, setFullName, email,
    setEmail, password, setPassword,
    loading, errors, handleSubmit } = useRegister();

  return (
    <>
      <AuthHeader subtitle="Únete a nosotros" />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="font-body text-sm text-foreground">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tu nombre"
                className="pl-10 font-body"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="font-body text-sm text-foreground">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tu@email.com"
                className="pl-10 font-body"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <PasswordInput
            value={password}
            onChange={setPassword}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
          <Button
            type="submit"
            className="w-full font-display tracking-wider uppercase text-sm"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Crear Cuenta"}
          </Button>

          <p className="font-body text-sm text-center text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </AuthCard>
    </>
  )
}
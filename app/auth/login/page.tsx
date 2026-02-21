"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

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
          </div>

          <PasswordInput value={password} onChange={setPassword} />

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
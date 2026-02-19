import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <AuthHeader subtitle="Únete a nosotros" />

      <AuthCard>
        <form className="space-y-5">
          <div className="space-y-2">
            <label className="font-body text-sm text-foreground">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tu nombre" className="pl-10 font-body" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-body text-sm text-foreground">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="tu@email.com" className="pl-10 font-body" />
            </div>
          </div>

          <PasswordInput />

          <Button type="submit" className="w-full font-display tracking-wider uppercase text-sm">
            Crear Cuenta
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
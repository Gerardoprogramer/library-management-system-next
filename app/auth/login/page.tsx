import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function loginPage() {
    return (
        <>
            <AuthHeader subtitle="Bienvenido de vuelta" />

            <AuthCard>
                <form className="space-y-5">
                    <div className="space-y-2">
                        <label className="font-body text-sm text-foreground">Correo electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="email" placeholder="tu@email.com" className="pl-10 font-body" />
                        </div>
                    </div>

                    <PasswordInput />

                    <Button type="submit" className="w-full font-display tracking-wider uppercase text-sm">
                        Iniciar Sesión
                    </Button>

                    <p className="font-body text-sm text-center text-muted-foreground">
                        ¿No tienes cuenta?{" "}
                        <Link href="/auth/register">
                            <button
                                type="button"

                                className="text-primary hover:underline font-medium"
                            >
                                Regístrate
                            </button>
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </>
    )
}

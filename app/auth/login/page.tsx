import { Gem, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function loginPage() {
    return (
        <>
            <div className="flex flex-col items-center mb-10">
                <div
                    className="w-14 h-14 bg-foreground flex items-center justify-center rotate-45 mb-4 cursor-pointer"

                >
                    <Gem className="w-7 h-7 text-background -rotate-45" strokeWidth={1.5} />
                </div>
                <h1 className="font-display text-2xl font-semibold text-foreground tracking-wider uppercase">
                    Obsidian Library
                </h1>
                <p className="font-body text-muted-foreground mt-1">
                    Bienvenido de vuelta
                </p>
            </div>

            <form  className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-5">
                <div className="space-y-2">
                    <label className="font-body text-sm text-foreground">Correo electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="email" placeholder="tu@email.com" className="pl-10 font-body" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="font-body text-sm text-foreground">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type={true ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 font-body"
                            value={""}
                            
                        />
                        <button
                            type="button"
                            
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {true ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full font-display tracking-wider uppercase text-sm">
                    Iniciar Sesión
                </Button>

                <p className="font-body text-sm text-center text-muted-foreground">
                    ¿No tienes cuenta?
                    <button
                        type="button"
                        
                        className="text-primary hover:underline font-medium"
                    >
                        Inicia sesión"
                    </button>
                </p>
            </form>
        </>
    )
}

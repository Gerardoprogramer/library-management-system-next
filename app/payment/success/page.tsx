'use client';

import { useEffect, useState } from "react";
import { CheckCircle, Sparkles, Receipt, ArrowRight, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePaymentDetails } from "@/hooks/queries/usePaymentDetails";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const { data: payment, isLoading, isError } = usePaymentDetails(sessionId);
  
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading && payment) {
      const timer = setTimeout(() => setReady(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading, payment]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="font-body text-muted-foreground animate-pulse">Generando tu recibo...</p>
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">!</span>
        </div>
        <p className="font-body text-foreground">No pudimos verificar el pago.</p>
        <Button variant="outline" onClick={() => router.push('/')}>Volver al inicio</Button>
      </div>
    );
  }

  const config: Record<string, { title: string; description: string; redirect: string; redirectLabel: string }> = {
    MEMBERSHIP: {
      title: "¡Membresía Activa!",
      description: payment.plan ? `Bienvenido al plan ${payment.plan}. Ya puedes disfrutar de todos los beneficios.` : "Tu suscripción se ha activado con éxito.",
      redirect: "/dashboard/subscription",
      redirectLabel: "Ver mi plan",
    },
    GENERAL: {
      title: "¡Pago Exitoso!",
      description: "Tu transacción ha sido procesada correctamente por nuestro sistema.",
      redirect: "/dashboard/catalogo",
      redirectLabel: "Ir al catálogo",
    },
  };

  const c = config[payment.type] || config.GENERAL;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-background/50">
      <Card className="max-w-md w-full border-primary/10 shadow-2xl overflow-hidden relative">

        <div className="h-3 w-full bg-linear-to-r from-primary/60 via-primary to-primary/60" />
        
        <CardContent className="p-8 sm:p-10 flex flex-col items-center text-center">
          

          <div className={`relative mb-8 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${ready ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-4"}`}>

            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-sm">
              <CheckCircle className="w-12 h-12 text-primary" strokeWidth={2} />
            </div>

            <Sparkles className={`absolute -top-3 -right-4 w-7 h-7 text-primary transition-all duration-700 delay-300 ${ready ? "opacity-100 rotate-12 scale-100" : "opacity-0 -rotate-45 scale-0"}`} />
            <Sparkles className={`absolute bottom-0 -left-5 w-5 h-5 text-primary/60 transition-all duration-700 delay-500 ${ready ? "opacity-100 -rotate-12 scale-100" : "opacity-0 rotate-45 scale-0"}`} />
          </div>


          <div className={`w-full transition-all duration-700 delay-100 ease-out ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h1 className="font-display text-3xl font-extrabold text-foreground mb-3 tracking-tight">
              {String(c.title)}
            </h1>
            <p className="font-body text-muted-foreground/90 mb-8 px-4 text-sm leading-relaxed">
              {String(c.description)}
            </p>


            <div className="relative bg-muted/40 border border-dashed border-border rounded-xl p-6 mb-8 w-full text-left overflow-hidden">

              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-background rounded-full transform -translate-y-1/2 border-r border-border border-dashed" />
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-background rounded-full transform -translate-y-1/2 border-l border-border border-dashed" />
              
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
                <Receipt className="w-5 h-5 text-primary" />
                <span className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">
                  Detalle de Transacción
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center font-body text-sm">
                  <span className="text-muted-foreground">Estado</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Completado
                  </span>
                </div>
                <div className="flex justify-between items-center font-body text-sm">
                  <span className="text-muted-foreground">Fecha</span>
                  <span className="text-foreground font-medium">{String(payment.date).split('T')[0]}</span>
                </div>
                <div className="flex justify-between items-center font-body pt-3 mt-3 border-t border-border/50">
                  <span className="text-muted-foreground font-medium">Total pagado</span>
                  <span className="font-display text-2xl font-bold text-foreground tracking-tight">
                    ${payment.amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button 
                onClick={() => router.push(c.redirect)} 
                className="w-full font-body h-12 text-md transition-all hover:scale-[1.02]"
                size="lg"
              >
                {c.redirectLabel}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')}
                className="w-full font-body text-muted-foreground hover:text-foreground"
              >
                <Home className="w-4 h-4 mr-2" /> 
                Volver al inicio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
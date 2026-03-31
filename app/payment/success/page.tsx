'use client';

import { useEffect, useState } from "react";
import { CheckCircle, Sparkles, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePaymentDetails } from "@/hooks/queries/usePaymentDetails";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data: payment, isLoading, isError } = usePaymentDetails(sessionId);
  
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading && payment) {
      const timer = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, payment]);

  if (isLoading) return <div className="flex justify-center p-20 font-body">Cargando recibo...</div>;
  if (isError || !payment) return <div className="flex justify-center p-20 font-body">Error al verificar el pago.</div>;

  const config: Record<string, { title: string; description: string; redirect: string; redirectLabel: string }> = {
    MEMBERSHIP: {
      title: "¡Membresía Activa!",
      description: payment.plan ? `Bienvenido al plan ${payment.plan}.` : "Tu suscripción se ha activado.",
      redirect: "/dashboard/subscription",
      redirectLabel: "Ver mi plan",
    },
    GENERAL: {
      title: "¡Pago Exitoso!",
      description: "Tu transacción ha sido procesada correctamente.",
      redirect: "/dashboard/catalogo",
      redirectLabel: "Volver al catálogo",
    },
  };

  const c = config[payment.type] || config.GENERAL;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-primary/20 shadow-xl overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardContent className="p-8 flex flex-col items-center text-center">
          
          <div className={`relative mb-6 transition-all duration-700 ease-out ${ready ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
            <Sparkles className={`absolute -top-2 -right-2 w-6 h-6 text-primary transition-all duration-500 ${ready ? "opacity-100" : "opacity-0"}`} />
          </div>

          <div className={`transition-all duration-600 ease-out ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">{String(c.title)}</h1>
            <p className="font-body text-muted-foreground mb-6">{String(c.description)}</p>

            <div className="bg-muted/30 rounded-lg p-4 mb-6 w-full">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-4 h-4 text-muted-foreground" />
                <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Resumen</span>
              </div>
              <div className="flex justify-between items-center font-body text-sm mb-1">
                <span className="text-muted-foreground">Monto</span>
                <span className="font-display text-lg font-bold text-foreground">${payment.amount}</span>
              </div>
              <div className="flex justify-between items-center font-body text-xs mt-1">
                <span className="text-muted-foreground">Fecha</span>
                <span className="text-foreground">{String(payment.date).split('T')[0]}</span>
              </div>
            </div>

            <Button className="w-full font-body">
              {c.redirectLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
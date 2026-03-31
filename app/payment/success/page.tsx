'use client';

import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, Sparkles, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePaymentDetails } from "@/hooks/queries/usePaymentDetails";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/date-utils";


export default function paymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  console.log("Session ID:", sessionId);
  const [showCheck, setShowCheck] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { data: payment, isLoading, isError } = usePaymentDetails(sessionId);
  console.log("Payment details:", payment);
  if (isLoading) return <div className="flex justify-center p-20">Cargando recibo...</div>;

  if (isError || !payment) return <div>Error al verificar el pago.</div>;

  useEffect(() => {
    const t1 = setTimeout(() => setShowCheck(true), 300);
    const t2 = setTimeout(() => setShowContent(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const config: Record<string, { title: string; description: string; redirect: string; redirectLabel: string }> = {
    MEMBERSHIP: {
      title: "¡Membresía Activa!",
      description: payment.plan ? `Bienvenido al plan ${payment.plan}.` : "Tu suscripción se ha activado.",
      redirect: "/dashboard/subscription",
      redirectLabel: "Ver mi plan",
    },
    FINE: {
      title: "¡Multa Pagada!",
      description: "Hemos registrado el pago de tu multa. Tu cuenta está al día.",
      redirect: "/dashboard/multas",
      redirectLabel: "Ir a mis multas",
    },
    LOST_BOOK_PENALTY: {
      title: "¡Penalidad Saldada!",
      description: "El cargo por el libro perdido ha sido cubierto correctamente.",
      redirect: "/dashboard/multas",
      redirectLabel: "Ver historial",
    },
    DAMAGED_BOOK_PENALTY: {
      title: "¡Cargo Procesado!",
      description: "El pago por el libro dañado ha sido recibido. Gracias por tu honestidad.",
      redirect: "/dashboard/multas",
      redirectLabel: "Ver historial",
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
        <div className="h-2 bg-linear-to-r from-primary via-primary/80 to-primary/60" />
        <CardContent className="p-8 flex flex-col items-center text-center">
          {/* Animated check */}
          <div className={`relative mb-6 transition-all duration-700 ease-out ${showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
            <Sparkles className={`absolute -top-2 -right-2 w-6 h-6 text-primary transition-all duration-500 delay-500 ${showCheck ? "opacity-100 rotate-0" : "opacity-0 -rotate-45"}`} />
            <Sparkles className={`absolute -bottom-1 -left-3 w-5 h-5 text-primary/60 transition-all duration-500 delay-700 ${showCheck ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`} />
          </div>

          {/* Content */}
          <div className={`transition-all duration-600 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">{c.title}</h1>
            <p className="font-body text-muted-foreground mb-6">{c.description}</p>

            {/* Receipt */}
            <div className="bg-muted/30 rounded-lg p-4 mb-6 w-full">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-4 h-4 text-muted-foreground" />
                <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Resumen</span>
              </div>
              <div className="flex justify-between items-center font-body text-sm mb-1">
                <span className="text-muted-foreground">Monto pagado</span>
                <span className="font-display text-lg font-bold text-foreground">${payment?.amount}</span>
              </div>
              <div className="flex justify-between items-center font-body text-xs">
                <span className="text-muted-foreground">Método</span>
                <span className="text-foreground">Stripe</span>
              </div>
              <div className="flex justify-between items-center font-body text-xs mt-1">
                <span className="text-muted-foreground">Fecha</span>
                <span className="text-foreground">{payment?.date ? String(payment.date).split('T')[0] : 'Hoy'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Button className="w-full font-body gap-2">
                {c.redirectLabel}
              </Button>
              <Button variant="ghost" className="w-full font-body gap-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Volver al catálogo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
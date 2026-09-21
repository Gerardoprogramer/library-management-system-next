import type { Metadata } from "next";
import Link from "next/link";
import { PiArrowLeft, PiCreditCard, PiXCircle } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pago cancelado",
  description: "El proceso de pago fue cancelado antes de completarse.",
};

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <PiXCircle className="size-7" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">Pago cancelado</h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Saliste del proceso de Stripe antes de completar la transacción. Podés volver a intentarlo cuando quieras.
          </p>

          <div className="mt-7 flex w-full flex-col gap-2">
            <Button asChild>
              <Link href="/dashboard/pay">
                <PiCreditCard />
                Ver pagos y multas
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/dashboard/subscription">Ver suscripciones</Link>
            </Button>

            <Button asChild variant="ghost" className="mt-1">
              <Link href="/dashboard">
                <PiArrowLeft />
                Volver al dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

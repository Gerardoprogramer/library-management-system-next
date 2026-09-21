"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PiArrowRight, PiCheckCircle, PiHouse, PiReceipt, PiSpinnerGap, PiWarningCircle } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePaymentDetails } from "@/hooks/queries/usePaymentDetails";

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");

  const { data: payment, isLoading, isError } = usePaymentDetails(sessionId);

  if (!sessionId) {
    return (
      <PaymentState
        title="Sesión de pago no válida"
        description="No encontramos el identificador necesario para verificar este pago."
        icon={<PiWarningCircle className="size-7" />}
        action={<Button onClick={() => router.push("/dashboard/pay")}>Ir a pagos</Button>}
      />
    );
  }

  if (isLoading || payment?.status === "PENDING") {
    return (
      <PaymentState
        title="Confirmando tu pago"
        description="Estamos verificando la transacción con Stripe. Esta pantalla se actualizará automáticamente."
        icon={<PiSpinnerGap className="size-7 animate-spin" />}
      />
    );
  }

  if (isError || !payment) {
    return (
      <PaymentState
        title="No pudimos verificar el pago"
        description="No fue posible recuperar la información de esta transacción. Podés revisar tu historial de pagos."
        icon={<PiWarningCircle className="size-7" />}
        action={
          <Button variant="outline" onClick={() => router.push("/dashboard/pay")}>
            Ver pagos
          </Button>
        }
      />
    );
  }

  if (payment.status === "FAILED" || payment.status === "CANCELLED") {
    return (
      <PaymentState
        title={payment.status === "CANCELLED" ? "Pago cancelado" : "No se pudo completar el pago"}
        description={
          payment.status === "CANCELLED"
            ? "La transacción fue cancelada y no se realizó ningún cobro."
            : "Stripe no pudo completar la transacción. Podés intentarlo nuevamente desde la plataforma."
        }
        icon={<PiWarningCircle className="size-7" />}
        action={<Button onClick={() => router.push("/dashboard/pay")}>Volver a pagos</Button>}
      />
    );
  }

  const isMembership = payment.type === "MEMBERSHIP";

  const redirectPath = isMembership ? "/dashboard/subscription" : "/dashboard/pay";

  const redirectLabel = isMembership ? "Ver mi suscripción" : "Ver mis pagos";

  const title =
    payment.status === "REFUNDED" ? "Pago reembolsado" : isMembership ? "Suscripción activada" : "Pago completado";

  const description =
    payment.status === "REFUNDED"
      ? "Esta transacción fue reembolsada."
      : isMembership && payment.plan
        ? `Tu plan ${payment.plan} está listo para usar.`
        : "Tu transacción fue procesada correctamente.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-10">
      <Card className="w-full max-w-lg overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PiCheckCircle className="size-7" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
          </div>

          <div className="mt-7 rounded-2xl border border-border/70 bg-muted/30 p-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PiReceipt className="size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">Detalle de la transacción</p>

                <p className="text-xs text-muted-foreground">Pago procesado mediante Stripe</p>
              </div>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <PaymentRow label="Estado" value={payment.status === "REFUNDED" ? "Reembolsado" : "Completado"} />

              <PaymentRow label="Fecha" value={formatDate(payment.date)} />

              {payment.description && <PaymentRow label="Concepto" value={payment.description} />}

              {payment.customerEmail && <PaymentRow label="Correo" value={payment.customerEmail} />}

              <div className="flex items-end justify-between gap-4 border-t border-border/60 pt-4">
                <dt className="text-muted-foreground">Total</dt>

                <dd className="text-xl font-semibold tracking-tight text-foreground">
                  {formatCurrency(payment.amount, payment.currency)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={() => router.push(redirectPath)}>
              {redirectLabel}
              <PiArrowRight />
            </Button>

            <Button variant="outline" className="flex-1" onClick={() => router.push("/dashboard")}>
              <PiHouse />
              Ir al dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

interface PaymentStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}

const PaymentState = ({ title, description, icon, action }: PaymentStateProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            {icon}
          </div>

          <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{title}</h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>

          {action && <div className="mt-6">{action}</div>}
        </CardContent>
      </Card>
    </main>
  );
};

interface PaymentRowProps {
  label: string;
  value: string;
}

const PaymentRow = ({ label, value }: PaymentRowProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>

      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
};

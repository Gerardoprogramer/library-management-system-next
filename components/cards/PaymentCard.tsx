"use client";

import {
  PiArrowCounterClockwise,
  PiCheckCircle,
  PiClock,
  PiCreditCard,
  PiReceipt,
  PiWarningCircle,
  PiXCircle,
} from "react-icons/pi";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/date-utils";
import type { Payment, PaymentStatus, PaymentType } from "@/lib/definitions";

interface Props {
  payment: Payment;
}

const paymentStatusConfig = {
  PENDING: {
    label: "Pendiente",
    variant: "outline",
    icon: PiClock,
  },
  SUCCESS: {
    label: "Completado",
    variant: "default",
    icon: PiCheckCircle,
  },
  FAILED: {
    label: "Fallido",
    variant: "destructive",
    icon: PiWarningCircle,
  },
  CANCELLED: {
    label: "Cancelado",
    variant: "secondary",
    icon: PiXCircle,
  },
  REFUNDED: {
    label: "Reembolsado",
    variant: "secondary",
    icon: PiArrowCounterClockwise,
  },
} satisfies Record<
  PaymentStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
  }
>;

const paymentTypeConfig = {
  FINE: "Multa",
  MEMBERSHIP: "Suscripción",
  LOST_BOOK_PENALTY: "Penalización por pérdida",
  DAMAGED_BOOK_PENALTY: "Penalización por daño",
  REFUND: "Reembolso",
} satisfies Record<PaymentType, string>;

const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency,
  }).format(amount);
};

export const PaymentCard = ({ payment }: Props) => {
  const statusConfig = paymentStatusConfig[payment.paymentStatus];

  const StatusIcon = statusConfig.icon;

  const effectiveDate = payment.completedAt ?? payment.refundedAt ?? payment.initiatedAt ?? payment.createdAt;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <PiReceipt className="size-4.5" />
              </div>

              <Badge variant="outline">{paymentTypeConfig[payment.paymentType]}</Badge>

              <Badge variant={statusConfig.variant}>
                <StatusIcon />
                {statusConfig.label}
              </Badge>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground">
                {payment.description || paymentTypeConfig[payment.paymentType]}
              </p>

              {payment.failureReason && (
                <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-destructive">
                  <PiWarningCircle className="mt-1 size-4 shrink-0" />

                  <p>{payment.failureReason}</p>
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <PaymentMeta label="Fecha" value={formatDate(effectiveDate)} />

              <PaymentMeta
                label="Pasarela"
                value={payment.paymentGateway === "STRIPE" ? "Stripe" : payment.paymentGateway}
              />

              {payment.transactionId && <PaymentMeta label="Transacción" value={payment.transactionId} mono />}

              {payment.refundedAt && <PaymentMeta label="Reembolsado" value={formatDate(payment.refundedAt)} />}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border/60 pt-4 md:min-w-44 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="md:text-right">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Monto</p>

              <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                {formatMoney(payment.amount, payment.currency)}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <PiCreditCard className="size-4" />
              <span>Stripe</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PaymentMetaProps {
  label: string;
  value: string | undefined;
  mono?: boolean;
}

const PaymentMeta = ({ label, value, mono = false }: PaymentMetaProps) => {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>

      <p
        className={
          mono ? "mt-1 truncate font-mono text-xs text-foreground" : "mt-1 text-sm font-medium text-foreground"
        }
      >
        {value ?? "—"}
      </p>
    </div>
  );
};

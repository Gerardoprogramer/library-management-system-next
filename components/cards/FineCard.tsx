"use client";

import { PiBookOpen, PiClock, PiCreditCard, PiGear, PiInfo, PiWarning } from "react-icons/pi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/date-utils";
import type { Fine, FineStatus, FineType } from "@/lib/definitions";

interface Props {
  fine: Fine;
  onPay: (fineId: string) => void;
  isPaying: boolean;
  payingFineId?: string;
}

const fineTypeConfig = {
  OVERDUE: {
    label: "Atraso",
    icon: PiClock,
  },
  DAMAGE: {
    label: "Daño",
    icon: PiWarning,
  },
  LOSS: {
    label: "Pérdida",
    icon: PiBookOpen,
  },
  PROCESSING: {
    label: "Procesamiento",
    icon: PiGear,
  },
} satisfies Record<
  FineType,
  {
    label: string;
    icon: React.ElementType;
  }
>;

const fineStatusConfig = {
  PENDING: {
    label: "Pendiente",
    variant: "destructive",
  },
  PARTIALLY_PAID: {
    label: "Pago parcial",
    variant: "outline",
  },
  PAID: {
    label: "Pagada",
    variant: "default",
  },
  WAIVED: {
    label: "Eximida",
    variant: "secondary",
  },
} satisfies Record<
  FineStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
>;

const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency,
  }).format(amount);
};

export const FineCard = ({ fine, onPay, isPaying, payingFineId }: Props) => {
  const typeConfig = fineTypeConfig[fine.type];
  const statusConfig = fineStatusConfig[fine.status];

  const TypeIcon = typeConfig.icon;

  const canPay = fine.status === "PENDING" || fine.status === "PARTIALLY_PAID";

  const isCurrentPayment = isPaying && payingFineId === fine.id;

  return (
    <Card className={fine.status === "PENDING" ? "overflow-hidden border-destructive/20" : "overflow-hidden"}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <TypeIcon className="size-4.5" />
              </div>

              <Badge variant="outline">{typeConfig.label}</Badge>

              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground">{fine.reason}</p>

              {fine.notes && (
                <div className="mt-2 flex max-w-2xl items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <PiInfo className="mt-1 size-4 shrink-0" />

                  <p>{fine.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <FineMeta label="Generada" value={formatDate(fine.createdAt)} />

              {fine.paidAt && <FineMeta label="Pagada" value={formatDate(fine.paidAt)} />}

              {fine.status === "WAIVED" && fine.waiverReason && (
                <FineMeta label="Motivo de exención" value={fine.waiverReason} />
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-border/60 pt-4 md:min-w-44 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="md:text-right">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Monto</p>

              <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                {formatMoney(fine.amount, fine.currency)}
              </p>
            </div>

            {canPay && (
              <Button type="button" size="sm" onClick={() => onPay(fine.id)} disabled={isPaying}>
                <PiCreditCard />

                {isCurrentPayment ? "Preparando..." : "Pagar con Stripe"}
              </Button>
            )}
          </div>
        </div>

        {fine.transactionId && (
          <div className="mt-5 border-t border-border/60 pt-4">
            <p className="text-xs text-muted-foreground">
              Transacción: <span className="font-mono text-foreground">{fine.transactionId}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface FineMetaProps {
  label: string;
  value: string | undefined;
}

const FineMeta = ({ label, value }: FineMetaProps) => {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-medium text-foreground">{value ?? "—"}</p>
    </div>
  );
};

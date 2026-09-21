"use client";

import { useState } from "react";
import { PiArrowsClockwise, PiBooks, PiCalendarBlank, PiClock, PiXCircle } from "react-icons/pi";

import { CancelSubscriptionDialog } from "@/components/dialog/CancelSubscriptionDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCancelSubscriptionActions } from "@/hooks/mutations/useCancelSubscriptionActions";
import { formatDate } from "@/lib/date-utils";
import type { Subscription } from "@/lib/definitions";

interface Props {
  subscription: Subscription;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);

export const SubscriptionCard = ({ subscription }: Props) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const [reason, setReason] = useState("");

  const { cancelSubscription, isCancelling } = useCancelSubscriptionActions();

  const isActive = subscription.active && !subscription.expired;

  const status = subscription.expired
    ? {
        label: "Expirada",
        variant: "destructive" as const,
      }
    : subscription.active
      ? {
          label: "Activa",
          variant: "default" as const,
        }
      : {
          label: "Cancelada",
          variant: "secondary" as const,
        };

  const handleCancel = () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      return;
    }

    cancelSubscription(
      {
        id: subscription.id,
        reason: trimmedReason,
      },
      {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setReason("");
        },
      }
    );
  };

  return (
    <>
      <Card className={isActive ? "overflow-hidden border-primary/25" : "overflow-hidden"}>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{subscription.planName}</h2>

                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">Plan {subscription.planCode}</p>
            </div>

            <div className="lg:text-right">
              <p className="text-2xl font-semibold tracking-tight text-foreground">{formatPrice(subscription.price)}</p>

              <p className="mt-1 text-xs text-muted-foreground">Precio del plan</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SubscriptionMetric icon={PiBooks} label="Máx. libros" value={subscription.maxBooksAllowed} />

            <SubscriptionMetric icon={PiClock} label="Días por libro" value={subscription.maxDaysPerBook} />

            <SubscriptionMetric
              icon={PiCalendarBlank}
              label="Días restantes"
              value={subscription.daysRemaining}
              destructive={isActive && subscription.daysRemaining <= 5}
            />

            <SubscriptionMetric
              icon={PiArrowsClockwise}
              label="Renovación"
              value={subscription.autoRenew ? "Automática" : "Manual"}
            />
          </div>

          <div className="mt-6 grid gap-4 border-t border-border/60 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <SubscriptionDate label="Inicio" value={formatDate(subscription.startDate)} />

            <SubscriptionDate label="Finalización" value={formatDate(subscription.endDate)} />

            {subscription.autoRenew && subscription.nextBillingDate && (
              <SubscriptionDate label="Próximo cobro" value={formatDate(subscription.nextBillingDate)} />
            )}
          </div>

          {subscription.cancelledAt && (
            <div className="mt-5 rounded-xl bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground">Suscripción cancelada</p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Cancelada el {formatDate(subscription.cancelledAt)}
                {subscription.cancellationReason ? ` · ${subscription.cancellationReason}` : ""}
              </p>
            </div>
          )}

          {isActive && (
            <div className="mt-6 border-t border-border/60 pt-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCancelDialogOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                <PiXCircle />
                Cancelar suscripción
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {cancelDialogOpen && (
        <CancelSubscriptionDialog
          sub={subscription}
          cancelDialog={cancelDialogOpen}
          setCancelDialog={setCancelDialogOpen}
          reason={reason}
          setReason={setReason}
          handleCancel={handleCancel}
          isPending={isCancelling}
        />
      )}
    </>
  );
};

interface SubscriptionMetricProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  destructive?: boolean;
}

const SubscriptionMetric = ({ icon: Icon, label, value, destructive = false }: SubscriptionMetricProps) => {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
      <Icon className="size-5 text-primary" />

      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>

      <p
        className={
          destructive ? "mt-1 text-lg font-semibold text-destructive" : "mt-1 text-lg font-semibold text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
};

interface SubscriptionDateProps {
  label: string;
  value: string | undefined;
}

const SubscriptionDate = ({ label, value }: SubscriptionDateProps) => {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-medium text-foreground">{value ?? "—"}</p>
    </div>
  );
};

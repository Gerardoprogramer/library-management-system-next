"use client";

import { useState } from "react";
import { PiBooks, PiCheckCircle, PiClock, PiCreditCard } from "react-icons/pi";

import { PaymentDialog } from "@/components/dialog/PaymentDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSubscribeActions } from "@/hooks/mutations/useSubscribeActions";
import type { SubscriptionPlan } from "@/lib/definitions";

interface Props {
  plan: SubscriptionPlan;
  isCurrent?: boolean;
}

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency,
  }).format(price / 100);

export const SubscriptionPlanCard = ({ plan, isCurrent = false }: Props) => {
  const [payDialog, setPayDialog] = useState(false);

  const [autoRenew, setAutoRenew] = useState(true);

  const { isLoading, subscribeMutation } = useSubscribeActions(setPayDialog);

  const handlePayment = () => {
    subscribeMutation.mutate({
      planId: plan.id,
      autoRenew,
      notes: `Suscripción al plan ${plan.name}`,
    });
  };

  return (
    <>
      <Card className={plan.featured ? "relative h-full border-primary/30 shadow-sm" : "relative h-full"}>
        <CardContent className="flex h-full flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{plan.name}</h3>

              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {plan.durationDays} días
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isCurrent && <Badge>Plan actual</Badge>}

              {!isCurrent && plan.badgeText && <Badge variant="secondary">{plan.badgeText}</Badge>}
            </div>
          </div>

          <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>

          <div className="mt-5">
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {formatPrice(plan.price, plan.currency)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">por {plan.durationDays} días</p>
          </div>

          <div className="my-6 space-y-3 border-y border-border/60 py-5">
            <PlanFeature icon={PiBooks} text={`Hasta ${plan.maxBooksAllowed} libros simultáneos`} />

            <PlanFeature icon={PiClock} text={`${plan.maxDaysPerBook} días por libro`} />

            <PlanFeature icon={PiCheckCircle} text={`${plan.durationDays} días de vigencia`} />
          </div>

          <Button
            type="button"
            className="mt-auto w-full"
            variant={isCurrent ? "secondary" : "default"}
            disabled={isCurrent || !plan.active || isLoading}
            onClick={() => setPayDialog(true)}
          >
            {isCurrent ? (
              <>
                <PiCheckCircle />
                Plan actual
              </>
            ) : !plan.active ? (
              "No disponible"
            ) : (
              <>
                <PiCreditCard />
                Seleccionar plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {!isCurrent && (
        <PaymentDialog
          payDialog={payDialog}
          setPayDialog={setPayDialog}
          selectedPlan={plan}
          isLoading={isLoading}
          handlePayment={handlePayment}
          autoRenew={autoRenew}
          setAutoRenew={setAutoRenew}
        />
      )}
    </>
  );
};

interface PlanFeatureProps {
  icon: React.ElementType;
  text: string;
}

const PlanFeature = ({ icon: Icon, text }: PlanFeatureProps) => (
  <div className="flex items-center gap-3 text-sm text-muted-foreground">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="size-4" />
    </div>

    <span>{text}</span>
  </div>
);

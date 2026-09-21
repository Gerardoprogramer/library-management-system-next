"use client";

import type { Dispatch, SetStateAction } from "react";
import { PiCheckCircle, PiCreditCard, PiLockKey, PiSpinnerGap } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { SubscriptionPlan } from "@/lib/definitions";

interface Props {
  payDialog: boolean;
  setPayDialog: Dispatch<SetStateAction<boolean>>;
  autoRenew: boolean;
  setAutoRenew: Dispatch<SetStateAction<boolean>>;
  selectedPlan: SubscriptionPlan;
  isLoading: boolean;
  handlePayment: () => void;
}

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency,
  }).format(price / 100);

export const PaymentDialog = ({
  payDialog,
  setPayDialog,
  autoRenew,
  setAutoRenew,
  selectedPlan,
  isLoading,
  handlePayment,
}: Props) => {
  const handleOpenChange = (open: boolean) => {
    if (isLoading && !open) {
      return;
    }

    setPayDialog(open);
  };

  return (
    <Dialog open={payDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiCreditCard className="size-5" />
          </div>

          <DialogTitle>Confirmar suscripción</DialogTitle>

          <DialogDescription>Revisá el plan antes de continuar al pago seguro con Stripe.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Plan seleccionado
                </p>

                <h3 className="mt-2 text-lg font-semibold text-foreground">{selectedPlan.name}</h3>

                <p className="mt-1 text-sm text-muted-foreground">{selectedPlan.durationDays} días de vigencia</p>
              </div>

              {selectedPlan.badgeText && (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {selectedPlan.badgeText}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-border/60 pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Hasta {selectedPlan.maxBooksAllowed} libros simultáneos</p>

                <p className="mt-1 text-sm text-muted-foreground">{selectedPlan.maxDaysPerBook} días por préstamo</p>
              </div>

              <p className="shrink-0 text-xl font-semibold tracking-tight text-foreground">
                {formatPrice(selectedPlan.price, selectedPlan.currency)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 p-4">
            <div className="min-w-0">
              <Label htmlFor="auto-renew" className="text-sm font-medium">
                Renovación automática
              </Label>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Permití que el sistema intente renovar el plan automáticamente al finalizar su vigencia.
              </p>
            </div>

            <Switch
              id="auto-renew"
              checked={autoRenew}
              onCheckedChange={setAutoRenew}
              disabled={isLoading}
              className="shrink-0"
            />
          </div>

          <div className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
            <PiLockKey className="mt-0.5 size-4 shrink-0 text-primary" />

            <p>
              Al continuar serás redirigido a Stripe para completar el pago. Los datos de pago se procesan en la
              plataforma de Stripe.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Volver
          </Button>

          <Button type="button" onClick={handlePayment} disabled={isLoading}>
            {isLoading ? (
              <>
                <PiSpinnerGap className="animate-spin" />
                Preparando pago...
              </>
            ) : (
              <>
                <PiCreditCard />
                Continuar a Stripe
              </>
            )}
          </Button>
        </DialogFooter>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <PiCheckCircle className="size-4 text-primary" />
            Creando una sesión de pago segura…
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

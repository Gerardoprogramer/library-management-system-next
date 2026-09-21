"use client";

import type { Dispatch, SetStateAction } from "react";
import { PiWarning, PiXCircle } from "react-icons/pi";

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
import { Textarea } from "@/components/ui/textarea";
import type { Subscription } from "@/lib/definitions";

interface Props {
  sub: Subscription;
  cancelDialog: boolean;
  setCancelDialog: Dispatch<SetStateAction<boolean>>;
  reason: string;
  setReason: Dispatch<SetStateAction<string>>;
  handleCancel: () => void;
  isPending: boolean;
}

export const CancelSubscriptionDialog = ({
  sub,
  cancelDialog,
  setCancelDialog,
  reason,
  setReason,
  handleCancel,
  isPending,
}: Props) => {
  const handleOpenChange = (open: boolean) => {
    if (isPending && !open) {
      return;
    }

    setCancelDialog(open);

    if (!open) {
      setReason("");
    }
  };

  return (
    <Dialog open={cancelDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <PiXCircle className="size-5" />
          </div>

          <DialogTitle>Cancelar suscripción</DialogTitle>

          <DialogDescription>Vas a cancelar el plan «{sub.planName}».</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <PiWarning className="mt-0.5 size-5 shrink-0 text-destructive" />

            <p className="text-sm leading-6 text-muted-foreground">
              La suscripción quedará inactiva inmediatamente y la renovación automática será deshabilitada.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancel-reason">Motivo de cancelación</Label>

            <Textarea
              id="cancel-reason"
              value={reason}
              maxLength={255}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Contanos por qué querés cancelar el plan."
              className="min-h-28 resize-y"
              disabled={isPending}
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">El motivo es obligatorio.</p>

              <span className="text-xs text-muted-foreground">{reason.length}/255</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Mantener suscripción
          </Button>

          <Button type="button" variant="destructive" onClick={handleCancel} disabled={!reason.trim() || isPending}>
            <PiXCircle />

            {isPending ? "Cancelando..." : "Cancelar suscripción"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { useState } from "react";
import { PiArrowsClockwise, PiCalendarBlank } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/date-utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  dueDate: string;
  maxDaysPerBook: number;
  isPending: boolean;
  onConfirm: (extensionDays: number, notes?: string) => void;
}

export const RenewLoanDialog = ({
  open,
  onOpenChange,
  bookTitle,
  dueDate,
  maxDaysPerBook,
  isPending,
  onConfirm,
}: Props) => {
  const [extensionDays, setExtensionDays] = useState(1);
  const [notes, setNotes] = useState("");

  const safeMaxDays = Math.max(1, maxDaysPerBook);

  const newDueDate = new Date(dueDate);
  newDueDate.setDate(newDueDate.getDate() + extensionDays);

  const handleDaysChange = (value: string) => {
    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      setExtensionDays(1);
      return;
    }

    setExtensionDays(Math.max(1, Math.min(parsed, safeMaxDays)));
  };

  const handleConfirm = () => {
    onConfirm(extensionDays, notes.trim() || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiArrowsClockwise className="size-5" />
          </div>

          <DialogTitle>Renovar préstamo</DialogTitle>

          <DialogDescription>
            Extendé el préstamo de «{bookTitle}». Tu plan permite extenderlo hasta {safeMaxDays} días.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="renewal-days" className="text-sm font-medium text-foreground">
              Días de extensión
            </label>

            <Input
              id="renewal-days"
              type="number"
              min={1}
              max={safeMaxDays}
              value={extensionDays}
              onChange={(event) => handleDaysChange(event.target.value)}
            />

            <div className="flex items-start gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
              <PiCalendarBlank className="mt-0.5 size-4 shrink-0" />

              <div>
                <p>
                  Vencimiento actual: <span className="font-medium text-foreground">{formatDate(dueDate)}</span>
                </p>

                <p className="mt-0.5">
                  Nuevo vencimiento:{" "}
                  <span className="font-medium text-foreground">
                    {newDueDate.toLocaleDateString("es-CR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="renewal-notes" className="text-sm font-medium text-foreground">
              Notas <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>

            <Textarea
              id="renewal-notes"
              value={notes}
              maxLength={500}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Agregá una nota sobre la renovación..."
              className="min-h-24 resize-none"
            />

            <p className="text-right text-xs text-muted-foreground">{notes.length}/500</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>

          <Button type="button" onClick={handleConfirm} disabled={isPending}>
            <PiArrowsClockwise className={isPending ? "animate-spin" : ""} />

            {isPending ? "Renovando..." : "Confirmar renovación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiArrowRight, PiBell, PiInfo, PiXCircle } from "react-icons/pi";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCancelReservation } from "@/hooks/mutations/useCancelReservation";
import { useCurrentUrl } from "@/hooks/Utilidades/useCurrentUrl";
import { useQueryParams } from "@/hooks/Utilidades/useQueryParams";
import { statusConfig } from "@/lib/data";
import { formatDate } from "@/lib/date-utils";
import type { reservationBook } from "@/lib/definitions";
import { createSlug } from "@/lib/slug-utils";

interface Props {
  data: reservationBook;
}

export const ReservationCard = ({ data }: Props) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const queryParams = useQueryParams();
  const currentUrl = useCurrentUrl();

  const { cancelReservation, isCancelling } = useCancelReservation(data.bookId);

  const config = statusConfig[data.status];

  const canCancel = data.status === "PENDING" || data.status === "AVAILABLE";

  const bookHref = {
    pathname: `/dashboard/book/${createSlug(data.bookId, data.bookTitle)}`,
    query: {
      ...queryParams,
      from: currentUrl,
    },
  };

  const handleCancel = () => {
    cancelReservation(data.id, {
      onSuccess: () => {
        setCancelDialogOpen(false);
      },
    });
  };

  return (
    <>
      <Card className={data.status === "AVAILABLE" ? "overflow-hidden border-primary/30" : "overflow-hidden"}>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <Link
              href={bookHref}
              aria-label={`Ver ${data.bookTitle}`}
              className="group relative aspect-3/4 w-full shrink-0 overflow-hidden bg-muted sm:w-32 md:w-36"
            >
              <Image
                src={data.bookCoverImageUrl}
                alt={`Portada de ${data.bookTitle}`}
                fill
                sizes="(max-width: 640px) 100vw, 144px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <Link href={bookHref} className="inline-block max-w-full">
                    <h3 className="line-clamp-2 text-base font-semibold leading-6 tracking-tight text-foreground transition-colors hover:text-primary sm:text-lg">
                      {data.bookTitle}
                    </h3>
                  </Link>

                  <p className="mt-1 text-sm text-muted-foreground">{data.author}</p>
                </div>

                <Badge variant={config.variant} className="shrink-0">
                  <config.icon />
                  {config.label}
                </Badge>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
                <ReservationMeta label="Reservado" value={formatDate(data.reservedAt)} />

                {data.status === "PENDING" && data.queuePosition != null && (
                  <ReservationMeta label="Posición" value={`#${data.queuePosition} en cola`} />
                )}

                {data.availableAt && <ReservationMeta label="Disponible desde" value={formatDate(data.availableAt)} />}

                {data.status === "AVAILABLE" && data.availableUntil && (
                  <ReservationMeta label="Retirar antes de" value={formatDate(data.availableUntil)} highlight />
                )}

                {data.fulfilledAt && <ReservationMeta label="Completada" value={formatDate(data.fulfilledAt)} />}

                {data.cancelledAt && <ReservationMeta label="Cancelada" value={formatDate(data.cancelledAt)} />}
              </div>

              {data.status === "AVAILABLE" && (
                <Alert variant="warning" className="mt-5">
                  <PiBell />

                  <AlertTitle>Libro disponible para retiro</AlertTitle>

                  <AlertDescription>
                    Tu reserva ya está disponible.
                    {data.availableUntil && (
                      <>
                        {" "}
                        Acercate a la biblioteca antes del{" "}
                        <span className="font-medium text-foreground">{formatDate(data.availableUntil)}</span>.
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {data.notes && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="mt-4 flex max-w-sm items-center gap-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <PiInfo className="size-4 shrink-0" />

                        <span className="truncate">{data.notes}</span>
                      </button>
                    </TooltipTrigger>

                    <TooltipContent side="bottom" className="max-w-xs">
                      {data.notes}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                {canCancel && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setCancelDialogOpen(true)}>
                    <PiXCircle />
                    Cancelar reserva
                  </Button>
                )}

                <Button asChild variant="ghost" size="sm">
                  <Link href={bookHref}>
                    Ver libro
                    <PiArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <PiXCircle className="size-5" />
            </div>

            <DialogTitle>Cancelar reserva</DialogTitle>

            <DialogDescription>
              Vas a cancelar tu reserva de «{data.bookTitle}». Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={isCancelling}>
              Volver
            </Button>

            <Button type="button" variant="destructive" onClick={handleCancel} disabled={isCancelling}>
              <PiXCircle />

              {isCancelling ? "Cancelando..." : "Cancelar reserva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ReservationMetaProps {
  label: string;
  value: string | undefined;
  highlight?: boolean;
}

const ReservationMeta = ({ label, value, highlight = false }: ReservationMetaProps) => {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>

      <p className={highlight ? "mt-1 text-sm font-semibold text-primary" : "mt-1 text-sm font-medium text-foreground"}>
        {value ?? "—"}
      </p>
    </div>
  );
};

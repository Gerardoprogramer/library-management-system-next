"use client";

import { PiBookmarkSimple, PiFunnel } from "react-icons/pi";

import { ReservationCard } from "@/components/cards/ReservationCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { ReservationPageSkeleton } from "@/components/custom/skeletons";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useReservation } from "@/hooks/queries/useReservation";
import { reservationOptions } from "@/lib/data";

export default function ReservationPage() {
  const { reservations, status, activeOnly, isLoading, setStatus, toggleActiveOnly } = useReservation();

  if (isLoading) {
    return <ReservationPageSkeleton />;
  }

  const totalElements = reservations?.totalElements ?? 0;

  const selectedStatusLabel =
    status === "all" ? "Todos" : (reservationOptions.find((option) => option.id === status)?.name ?? "Todos");

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PiBookmarkSimple className="size-4.5" />
            </div>

            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Biblioteca personal
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Mis reservas</h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Consultá tu posición en cola, libros disponibles, fechas límite y el historial de tus reservas.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PiFunnel className="size-4" />

            <span>Estado:</span>

            <Badge variant="secondary">{selectedStatusLabel}</Badge>
          </div>

          <CustomSelect
            headline="Todos los estados"
            options={reservationOptions}
            selectedItem={status}
            setSelectedItem={setStatus}
          />

          <div className="flex h-10 items-center gap-2 rounded-lg border border-border/70 bg-background px-3">
            <Switch id="active-reservations" checked={activeOnly} onCheckedChange={toggleActiveOnly} />

            <Label htmlFor="active-reservations" className="cursor-pointer whitespace-nowrap text-sm">
              Solo activas
            </Label>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border/60 py-3">
        <p className="text-sm text-muted-foreground">
          {totalElements === 0 ? "Sin resultados" : totalElements === 1 ? "1 reserva" : `${totalElements} reservas`}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {status !== "all" && <span>Estado: {selectedStatusLabel}</span>}

          {activeOnly && <Badge variant="outline">Solo activas</Badge>}
        </div>
      </div>

      {totalElements === 0 ? (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <PiBookmarkSimple className="size-6" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-foreground">No hay reservas</h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {activeOnly
              ? "No tenés reservas activas en este momento."
              : status === "all"
                ? "Cuando reservés un libro sin disponibilidad, aparecerá aquí."
                : `No tenés reservas con el estado “${selectedStatusLabel}”.`}
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {reservations?.content.map((reservation) => (
            <ReservationCard key={reservation.id} data={reservation} />
          ))}
        </section>
      )}

      {reservations && reservations.totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <CustomPagination totalPages={reservations.totalPages} paramName="ReservationPage" />
        </div>
      )}
    </div>
  );
}

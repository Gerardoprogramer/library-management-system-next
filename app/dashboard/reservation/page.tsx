'use client'

import { reservationService } from "@/services/reservationService";
import { useQuery } from "@tanstack/react-query";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { reservationOptions } from "@/lib/data";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { ReservationCard } from "@/components/cards/ReservationCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useReservation } from "@/hooks/useReservation";


export default function ReservationPage() {

  const { reservations, setStatus, status, toggleAvailableOnly, availableOnly } = useReservation();

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
        Mis Préstamos
      </h1>
      <div className="flex justify-end py-4 gap-4">
        <CustomSelect headline="Todos los Status" options={reservationOptions} selectedItem={status} setSelectedItem={setStatus} />
        <div className="flex items-center space-x-2">
          <Switch
            id="available"
            checked={availableOnly}
            onCheckedChange={toggleAvailableOnly}
          />
          <Label htmlFor="available">Solo disponibles</Label>
        </div>
      </div>
      <div className="space-y-4">
        {reservations && reservations?.content.map((reservation) =>
          <ReservationCard key={reservation.id} data={reservation} />
        )}
      </div>
      {reservations && reservations?.totalPages > 1 && (
        <div className="px-4 mt-6">
          <CustomPagination totalPages={reservations?.totalPages} paramName="ReservationPage" />
        </div>
      )}
    </div>
  )
}
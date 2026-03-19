'use client'

import { reservationService } from "@/services/reservationService";
import { useQuery } from "@tanstack/react-query";
import {Clock, Bell, XCircle, CheckCircle} from "lucide-react"

const statusConfig = {
  waiting: { label: "En espera", icon: Clock, variant: "secondary" as const },
  available: { label: "¡Disponible!", icon: Bell, variant: "default" as const },
  cancelled: { label: "Cancelada", icon: XCircle, variant: "destructive" as const },
  fulfilled: { label: "Completada", icon: CheckCircle, variant: "secondary" as const },
};

export default function ReservationPage() {

  const { data: reservations } = useQuery({
    queryKey: ["reservations"],
    queryFn: () =>
      reservationService.getReservations(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
    <h1>Hola mundo {reservations?.totalElements}</h1>
    </>
  )
}
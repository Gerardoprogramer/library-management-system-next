import {Clock, Bell, XCircle, CheckCircle} from "lucide-react"

const statusConfig = {
  waiting: { label: "En espera", icon: Clock, variant: "secondary" as const },
  available: { label: "¡Disponible!", icon: Bell, variant: "default" as const },
  cancelled: { label: "Cancelada", icon: XCircle, variant: "destructive" as const },
  fulfilled: { label: "Completada", icon: CheckCircle, variant: "secondary" as const },
};

export default function ReservationPage() {
  return (
    <>
    </>
  )
}
import {
  BookOpen, Clock, Bookmark, Heart,
  Star, Shield, Users, BarChart3, Gem, CheckCircle,
  AlertTriangle, XCircle, PackageX
} from "lucide-react";
import type { navLinkstype, statusLoan, selectOptions, typeLoans } from "./definitions";


export const userNav: navLinkstype[] = [
  { label: "Catálogo", path: "/dashboard/catalog", icon: BookOpen },
  { label: "Mis Préstamos", path: "/dashboard/loans", icon: Clock },
  { label: "Mis Reservas", path: "/dashboard/reservation", icon: Bookmark },
  { label: "Mi Wishlist", path: "/dashboard/wishlist", icon: Heart },
  { label: "Mis Reseñas", path: "/dashboard/review", icon: Star },
  { label: "pagos y multas", path: "/dashboard/pay", icon: Gem },
  { label: "Subscripciónes", path: "/dashboard/subscription", icon: Gem }
];

export const adminNav: navLinkstype[] = [
  { label: "Panel Admin", path: "/dashboard/admin", icon: Shield },
  { label: "Usuarios", path: "/dashboard/admin/usuarios", icon: Users },
  { label: "Estadísticas", path: "/dashboard/admin/stats", icon: BarChart3 },
];

export const typeLoanConfig: Record<typeLoans, { label: string }> = {
  "CHECKOUT": {
    label: "Prestado"
  },
  "RENEWAL": {
    label: "Renovación"
  },
  "RETURN": {
    label: "Devuelto"
  }
}

export const statusLoanConfig: Record<
  statusLoan,
  {
    label: string;
    icon: any;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  CHECKED_OUT: {
    label: "Prestado",
    icon: CheckCircle,
    variant: "default",
  },
  OVERDUE: {
    label: "Vencido",
    icon: AlertTriangle,
    variant: "destructive",
  },
  RETURNED: {
    label: "Devuelto",
    icon: CheckCircle,
    variant: "secondary",
  },
  LOST: {
    label: "Perdido",
    icon: XCircle,
    variant: "destructive",
  },
  DAMAGED: {
    label: "Dañado",
    icon: PackageX,
    variant: "outline",
  },
};

export const LoanOptions: selectOptions[] = [
  { id: "CHECKED_OUT", name: "Prestado" },
  { id: "RETURNED", name: "Devuelto" },
  { id: "OVERDUE", name: "Vencido" },
  { id: "LOST", name: "Perdido" },
  { id: "DAMAGED", name: "Dañado" }
];
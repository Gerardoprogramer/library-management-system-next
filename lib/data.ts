import {
  PiBell,
  PiBookmarkSimple,
  PiBookOpen,
  PiChartBar,
  PiCheckCircle,
  PiClock,
  PiCreditCard,
  PiCrown,
  PiHeart,
  PiPackage,
  PiShieldCheck,
  PiStar,
  PiUsersThree,
  PiWarning,
  PiXCircle,
} from "react-icons/pi";
import type { navLinkstype, statusLoan, selectOptions, typeLoans, reservationStatus } from "./definitions";
import type { ElementType } from "react";

export const userNav: navLinkstype[] = [
  { label: "Catálogo", path: "/dashboard/catalog", icon: PiBookOpen },
  { label: "Mis préstamos", path: "/dashboard/loans", icon: PiClock },
  { label: "Mis reservas", path: "/dashboard/reservation", icon: PiBookmarkSimple },
  { label: "Mi wishlist", path: "/dashboard/wishlist", icon: PiHeart },
  { label: "Mis reseñas", path: "/dashboard/review", icon: PiStar },
  { label: "Pagos y multas", path: "/dashboard/pay", icon: PiCreditCard },
  { label: "Suscripciones", path: "/dashboard/subscription", icon: PiCrown },
];

export const adminNav: navLinkstype[] = [
  { label: "Panel admin", path: "/dashboard/admin", icon: PiShieldCheck },
  { label: "Usuarios", path: "/dashboard/admin/usuarios", icon: PiUsersThree },
  { label: "Estadísticas", path: "/dashboard/admin/stats", icon: PiChartBar },
];

export const typeLoanConfig: Record<typeLoans, { label: string }> = {
  CHECKOUT: {
    label: "Prestado",
  },
  RENEWAL: {
    label: "Renovación",
  },
  RETURN: {
    label: "Devuelto",
  },
};

export const statusLoanConfig: Record<
  statusLoan,
  {
    label: string;
    icon: ElementType;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  CHECKED_OUT: {
    label: "Prestado",
    icon: PiCheckCircle,
    variant: "default",
  },
  OVERDUE: {
    label: "Vencido",
    icon: PiWarning,
    variant: "destructive",
  },
  RETURNED: {
    label: "Devuelto",
    icon: PiCheckCircle,
    variant: "secondary",
  },
  LOST: {
    label: "Perdido",
    icon: PiXCircle,
    variant: "destructive",
  },
  DAMAGED: {
    label: "Dañado",
    icon: PiPackage,
    variant: "outline",
  },
};

export const LoanOptions: selectOptions[] = [
  { id: "CHECKED_OUT", name: "Prestado" },
  { id: "RETURNED", name: "Devuelto" },
  { id: "OVERDUE", name: "Vencido" },
  { id: "LOST", name: "Perdido" },
  { id: "DAMAGED", name: "Dañado" },
];

export const reservationOptions: selectOptions[] = [
  { id: "PENDING", name: "Pendiente" },
  { id: "AVAILABLE", name: "Disponible" },
  { id: "FULFILLED", name: "Cumplido" },
  { id: "CANCELLED", name: "Cancelado" },
  { id: "EXPIRED", name: "Caducado" },
];

export const statusConfig: Record<
  reservationStatus,
  {
    label: string;
    icon: ElementType;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: {
    label: "En espera",
    icon: PiClock,
    variant: "secondary",
  },
  AVAILABLE: {
    label: "¡Disponible!",
    icon: PiBell,
    variant: "default",
  },
  CANCELLED: {
    label: "Cancelada",
    icon: PiXCircle,
    variant: "outline",
  },
  FULFILLED: {
    label: "Completada",
    icon: PiCheckCircle,
    variant: "secondary",
  },
  EXPIRED: {
    label: "Expirada",
    icon: PiXCircle,
    variant: "destructive",
  },
};

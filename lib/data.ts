import { BookOpen, Clock, Bookmark, Heart, Star, Shield, Users, BarChart3, Gem } from "lucide-react";
import { navLinkstype } from "./definitions";


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


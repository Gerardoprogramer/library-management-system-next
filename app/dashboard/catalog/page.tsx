import type { Metadata } from "next";

import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explorá la colección de libros de Biblioteca Obsidian y buscá por título, autor, ISBN, género o disponibilidad.",
  alternates: {
    canonical: "/dashboard/catalog",
  },
};

export default function CatalogPage() {
  return <CatalogClient />;
}

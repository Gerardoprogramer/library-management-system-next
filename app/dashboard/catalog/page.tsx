import { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Catálogo de Libros | Biblioteca Obsidian",
  description: "Explora nuestra colección completa de conocimiento digital, notas interconectadas y recursos de tecnología.",
  openGraph: {
    title: "Catálogo de Libros | Gestión de Conocimiento",
    description: "Busca entre cientos de recursos y notas inspiradas en la metodología de Obsidian.",
    images: ["/og-catalogo.png"],
  },
  alternates: {
    canonical: "https://obsidian-delta-kohl.vercel.app/dashboard/catalog",
  },
};

export default function CatalogPage() {

  return <CatalogClient/>;
}
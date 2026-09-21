import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookDetail } from "@/components/book/BookDetail";
import { parseSlug } from "@/lib/slug-utils";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { title } = parseSlug(slug);

  return {
    title,
    description: `Consultá la información de ${title}, su disponibilidad, reseñas y opciones de préstamo o reserva en Biblioteca Obsidian.`,
    openGraph: {
      title: `${title} | Biblioteca Obsidian`,
      description: `Información, disponibilidad y reseñas de ${title} en Biblioteca Obsidian.`,
      type: "article",
    },
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const { id } = parseSlug(slug);

  if (!id || id.length < 36) {
    notFound();
  }

  return <BookDetail id={id} />;
}

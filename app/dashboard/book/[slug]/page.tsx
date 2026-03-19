import { Metadata } from "next";
import { BookDetail } from "@/components/book/BookDetail";
import { parseSlug } from "@/lib/slug-utils";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { title } = parseSlug(slug);

  return {
    title: `${title} | Biblioteca Obsidian`,
    description: `Detalles técnicos, notas y recursos sobre ${title}. Organiza tu conocimiento digital.`,
    openGraph: {
      title: title,
      description: `Gestión de conocimiento: ${title}`,
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

    return <BookDetail id={id} />
}
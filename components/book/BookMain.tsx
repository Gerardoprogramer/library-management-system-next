import { PiBarcode, PiBookOpen, PiCalendarBlank, PiGlobeHemisphereWest, PiStarFill } from "react-icons/pi";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date-utils";

interface BookMainProps {
  book: {
    isbn: string;
    title: string;
    author: string;
    genreName: string;
    publishedDate: string;
    language: string;
    pages: number;
    description: string;
    totalCopies: number;
    availableCopies: number;
    averageRating: number;
    totalReviews: number;
  };
}

export const BookMain = ({ book }: BookMainProps) => {
  const details = [
    {
      icon: PiCalendarBlank,
      label: "Publicado",
      value: formatDate(book.publishedDate),
    },
    {
      icon: PiBookOpen,
      label: "Páginas",
      value: `${book.pages}`,
    },
    {
      icon: PiGlobeHemisphereWest,
      label: "Idioma",
      value: book.language,
    },
    {
      icon: PiBarcode,
      label: "ISBN",
      value: book.isbn,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <Badge variant="outline" className="mb-4 font-normal text-muted-foreground">
          {book.genreName}
        </Badge>

        <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {book.title}
        </h1>

        <p className="mt-3 text-lg text-muted-foreground sm:text-xl">{book.author}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5">
            <PiStarFill className="size-4 text-primary" />

            <span className="text-sm font-semibold text-foreground">{book.averageRating.toFixed(1)}</span>

            <span className="text-xs text-muted-foreground">
              {book.totalReviews} {book.totalReviews === 1 ? "reseña" : "reseñas"}
            </span>
          </div>

          <Badge variant={book.availableCopies > 0 ? "default" : "destructive"} className="rounded-full px-3 py-1.5">
            {book.availableCopies > 0 ? `${book.availableCopies} de ${book.totalCopies} disponibles` : "No disponible"}
          </Badge>
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Sinopsis</h2>

        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
          {book.description || "Este libro no tiene una descripción disponible."}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">Detalles del libro</h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-2xl border border-border/70 bg-card p-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </div>

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {item.label}
                </p>

                <p className="mt-1 wrap-break-word text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

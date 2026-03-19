
import { Star, BookOpen, Calendar, Globe, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date-utils"

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
    }
}

export const BookMain = ({ book }: BookMainProps) => {
    return (
        <>
            <div>
                <Badge variant="outline" className="font-body mb-3">{book.genreName}</Badge>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">{book.title}</h1>
                <p className="font-body text-xl text-muted-foreground mb-4">{book.author}</p>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-primary text-primary" />
                        <span className="font-display text-lg font-semibold">{book.averageRating.toFixed(1)}</span>
                        <span className="font-body text-sm text-muted-foreground">({book.totalReviews} reseñas)</span>
                    </div>
                    <Badge variant={book.availableCopies > 0 ? "default" : "destructive"}>
                        {book.availableCopies > 0 ? `${book.availableCopies} de ${book.totalCopies} disponibles` : "No disponible"}
                    </Badge>
                </div>
            </div>

            <div>
                <h2 className="font-display text-lg font-semibold mb-3 text-foreground">Sinopsis</h2>
                <p className="font-body text-base text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { icon: Calendar, label: "Publicado", value: formatDate(book.publishedDate) },
                    { icon: BookOpen, label: "Páginas", value: book.pages.toString() },
                    { icon: Globe, label: "Idioma", value: book.language },
                    { icon: Hash, label: "ISBN", value: book.isbn.slice(-8) },
                ].map((item) => (
                    <div key={item.label} className="bg-card border border-border rounded-lg p-4">
                        <item.icon className="w-4 h-4 text-primary mb-2" />
                        <p className="font-body text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-display text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

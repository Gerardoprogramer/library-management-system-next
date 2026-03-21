
import { Trash2, BookOpen, StickyNote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { myWishlist } from "@/lib/definitions";
import Link from "next/link";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useCurrentUrl } from "@/hooks/useCurrentUrl";
import { createSlug } from "@/lib/slug-utils";
interface Porps {
    data: myWishlist;
    handleWishlistToggle: (bookId: string, isInWishlist: boolean) => void;
}

export const WishlistCard = ({ data, handleWishlistToggle }: Porps) => {

    const queryParams = useQueryParams();
    const currentUrl = useCurrentUrl();
    const available = data ? data.availableCopies > 0 : false;

    return (
        <div className="bg-card border border-border rounded-lg p-4 flex gap-4 hover:border-primary/30 transition-colors">
            <div className="relative w-16 h-24 shrink-0 overflow-hidden rounded shadow-sm">
                <Link
                    href={{
                        pathname: `/dashboard/book/${createSlug(data.bookId, data.bookTitle)}`,
                        query: { ...queryParams, from: currentUrl }
                    }}
                >
                    <Image
                        src={data.bookCoverImageUrl}
                        alt={data.bookTitle}
                        fill
                        sizes="64px"
                        className="object-cover cursor-pointer transition-transform hover:scale-105"
                    />
                </Link>
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
                <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1">{data.bookTitle}</h3>
                <p className="font-body text-sm text-muted-foreground mb-1">{data.bookAuthor}</p>
                <Badge variant={available ? "default" : "secondary"} className="font-body text-xs self-start mb-1">
                    {available ? "Disponible" : "No disponible"}
                </Badge>
                {data.notes && (
                    <p className="font-body text-xs text-muted-foreground flex items-center gap-1 mb-auto line-clamp-1">
                        <StickyNote className="w-3 h-3 shrink-0" /> {data.notes}
                    </p>
                )}
                <div className="flex gap-2 mt-3">
                    {available && (
                        <Button size="sm" className="font-body text-xs flex-1"><BookOpen className="w-3 h-3 mr-1" /> Pedir</Button>
                    )}
                    <Button
                        onClick={() => handleWishlistToggle(data.bookId, true)}
                        variant="outline" size="sm" className="font-body text-xs"><Trash2 className="w-3 h-3" /></Button>
                </div>
            </div>
        </div>
    );
}

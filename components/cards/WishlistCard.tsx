"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiArrowRight, PiCalendarBlank, PiHeartBreak, PiNote } from "react-icons/pi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentUrl } from "@/hooks/Utilidades/useCurrentUrl";
import { useQueryParams } from "@/hooks/Utilidades/useQueryParams";
import { formatDate } from "@/lib/date-utils";
import type { myWishlist } from "@/lib/definitions";
import { createSlug } from "@/lib/slug-utils";

interface Props {
  data: myWishlist;
  handleWishlistToggle: (bookId: string, isInWishlist: boolean, onSuccess?: () => void) => void;
  isPending: boolean;
}

export const WishlistCard = ({ data, handleWishlistToggle, isPending }: Props) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const queryParams = useQueryParams();
  const currentUrl = useCurrentUrl();

  const available = data.availableCopies > 0;

  const bookHref = {
    pathname: `/dashboard/book/${createSlug(data.bookId, data.bookTitle)}`,
    query: {
      ...queryParams,
      from: currentUrl,
    },
  };

  const handleRemove = () => {
    handleWishlistToggle(data.bookId, true, () => setRemoveDialogOpen(false));
  };

  return (
    <>
      <Card className="h-full overflow-hidden">
        <CardContent className="flex h-full gap-4 p-4">
          <Link
            href={bookHref}
            aria-label={`Ver ${data.bookTitle}`}
            className="group relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={data.bookCoverImageUrl}
              alt={`Portada de ${data.bookTitle}`}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col">
            <div>
              <div className="flex items-start justify-between gap-2">
                <Link href={bookHref} className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground transition-colors hover:text-primary">
                    {data.bookTitle}
                  </h3>
                </Link>

                <Badge variant={available ? "default" : "secondary"} className="shrink-0">
                  {available ? "Disponible" : "No disponible"}
                </Badge>
              </div>

              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{data.bookAuthor}</p>
            </div>

            <div className="mt-3 space-y-2">
              {data.notes && (
                <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                  <PiNote className="mt-0.5 size-4 shrink-0" />

                  <p className="line-clamp-2">{data.notes}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <PiCalendarBlank className="size-4 shrink-0" />

                <span>Guardado el {formatDate(data.addedAt)}</span>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-4">
              <Button asChild variant={available ? "default" : "outline"} size="sm" className="flex-1">
                <Link href={bookHref}>
                  Ver libro
                  <PiArrowRight />
                </Link>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Quitar ${data.bookTitle} de la lista de deseos`}
                onClick={() => setRemoveDialogOpen(true)}
                className="text-muted-foreground hover:text-destructive"
              >
                <PiHeartBreak />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <PiHeartBreak className="size-5" />
            </div>

            <DialogTitle>Quitar de la lista</DialogTitle>

            <DialogDescription>
              «{data.bookTitle}» dejará de aparecer en tu lista de deseos. Podés volver a agregarlo cuando querás.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRemoveDialogOpen(false)} disabled={isPending}>
              Volver
            </Button>

            <Button type="button" variant="destructive" onClick={handleRemove} disabled={isPending}>
              <PiHeartBreak />
              {isPending ? "Quitando..." : "Quitar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

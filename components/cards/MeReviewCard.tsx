
import { Button } from "@/components/ui/button";
import { Clock, Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { createSlug } from "@/lib/slug-utils";
import { useCurrentUrl } from "@/hooks/Utilidades/useCurrentUrl";
import { useQueryParams } from "@/hooks/Utilidades/useQueryParams";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";
import type { Review } from "@/lib/definitions";
import { useReviewActions } from "@/hooks/mutations/useReviewActions";
import { useDeleteReview } from "@/hooks/mutations/useDeleteReviewActions";
import { useState } from "react";
import { ReviewFormDialog } from "../dialog/ReviewFormDialog";
import { DeleteReviewDialog } from "../dialog/DeleteReviewDialog";

interface Props {
    review: Review;
}

export const MeReviewCard = ({ review }: Props) => {
    const currentUrl = useCurrentUrl();
    const queryParams = useQueryParams();
    const { performReview, isPending } = useReviewActions(review.id, { type: "mine" }, review.rating);
    const { deleteReview, isDeleting } = useDeleteReview(review.id, { type: "mine" }, review.rating);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleSave = (formValues: { rating: number; title: string; reviewText: string }) => {
        performReview(formValues);
        setEditDialogOpen(false);
    }

    const handleDelete = () => {
        deleteReview();
        setDeleteDialogOpen(false);
    }

    return (
        <div key={review.id} className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
            <Link
                href={{
                    pathname: `/dashboard/book/${createSlug(review.bookId, review.bookTitle)}`,
                    query: { ...queryParams, from: currentUrl }
                }}
                className="relative w-full sm:w-32 md:w-40 aspect-2/3 sm:aspect-auto shrink-0 overflow-hidden shadow-xl"
            >
                <Image
                    src={review.coverImageUrl}
                    alt={review.bookTitle}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 640px) 100vw, 160px"
                    priority={false}
                />
            </Link>
            <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-foreground mb-1">{review.bookTitle}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                        <Button
                            onClick={() => setEditDialogOpen(true)}
                            variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            onClick={() => setDeleteDialogOpen(true)}
                            variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                    ))}
                </div>
                {review.title && (
                    <p className="font-display text-sm font-medium text-foreground mb-1">{review.title}</p>
                )}
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2">{review.reviewText}</p>
                <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(review.createdAt)}
                </p>
            </div>

            {editDialogOpen && (
                <ReviewFormDialog
                    bookTitle={review.bookTitle}
                    review={review}
                    isOpen={editDialogOpen}
                    setIsOpen={setEditDialogOpen}
                    isPending={isPending}
                    handleSave={handleSave}
                    mode="edit"
                />
            )}

            {deleteDialogOpen && (
                <DeleteReviewDialog
                    confirmDelete={handleDelete}
                    deleteDialogOpen={deleteDialogOpen}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    isPending={isDeleting}
                />
            )}
        </div>
    )
}

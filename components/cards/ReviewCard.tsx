
import { Clock, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/date-utils"
import { ReviewFormDialog } from "../dialog/ReviewFormDialog";
import { useState } from "react";
import type { Review } from "@/lib/definitions";
import { useReviewActions } from "@/hooks/mutations/useReviewActions";
import { DeleteReviewDialog } from "../dialog/DeleteReviewDialog";
import { useDeleteReview } from "@/hooks/mutations/useDeleteReviewActions";


interface Props {
    review: Review;
    userId?: string;
    bookTitle: string;
    bookId: string;
}

export const ReviewCard = ({ review, userId, bookTitle, bookId }: Props) => {

    const { performReview, isPending } = useReviewActions(review.id, { type: "book", id: bookId }, review.rating);
    const { deleteReview, isDeleting } = useDeleteReview(review.id, { type: "book", id: bookId }, review.rating);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const isOwn = userId === review.userId;


    const handleSave = (formValues: { rating: number; title: string; reviewText: string }) => {
        performReview(formValues);
        setEditDialogOpen(false);
    }

    const handleDelete = () => {
        deleteReview();
        setDeleteDialogOpen(false);
    }


    return (
        <div key={review.id} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-foreground">{review.userName}</span>
                    {isOwn && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Tú</Badge>}
                </div>
                <div className="flex items-center gap-2">
                    {isOwn && (
                        <>
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
                        </>
                    )}
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                        ))}
                    </div>
                </div>
            </div>
            {review.title && (
                <p className="font-display text-sm font-medium text-foreground mb-1">{review.title}</p>
            )}
            <p className="font-body text-sm text-muted-foreground">{review.reviewText}</p>
            <p className="font-body text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatDate(review.createdAt)}
            </p>
            {
                editDialogOpen && (
                    <ReviewFormDialog
                        bookTitle={bookTitle}
                        review={review}
                        isOpen={editDialogOpen}
                        setIsOpen={setEditDialogOpen}
                        isPending={isPending}
                        handleSave={handleSave}
                        mode="edit"
                    />
                )
            }
            <DeleteReviewDialog
                confirmDelete={handleDelete}
                deleteDialogOpen={deleteDialogOpen}
                setDeleteDialogOpen={setDeleteDialogOpen}
                isPending={isDeleting}
            />
        </div>
    )
}

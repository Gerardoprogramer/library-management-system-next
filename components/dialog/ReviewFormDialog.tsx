import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Star } from "lucide-react";
import type { Review } from "@/lib/definitions";
import { reviewSchema } from "@/schemas/review.schema";
import { useState, useEffect } from "react";
import { useReviewForm } from "@/hooks/ui/useReviewForm";

interface Props {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    bookTitle: string;
    review?: Review;
    handleSave: (formValues: { rating: number; title: string; reviewText: string }) => void;
    isPending: boolean;
    mode: "create" | "edit";
}

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => onChange(i + 1)} className="focus:outline-none transition-transform active:scale-110">
                <Star className={`w-5 h-5 transition-colors ${i < value ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary/50"}`} />
            </button>
        ))}
    </div>
);

export const ReviewFormDialog = ({ isOpen, setIsOpen, bookTitle, handleSave, isPending, mode, review }: Props) => {
    const [validationError, setValidationError] = useState<string | null>(null);

    const { formRating, formText, formTitle, setFormRating, setFormText, setFormTitle } = useReviewForm(review);

    useEffect(() => {
        if (!isOpen) setValidationError(null);
    }, [isOpen]);

    const onValidateAndSave = () => {
        const result = reviewSchema.safeParse({
            title: formTitle,
            reviewText: formText,
            rating: formRating
        });

        if (!result.success) {
            setValidationError(result.error.issues[0].message);
            return;
        }

        setValidationError(null);
        handleSave({ rating: formRating, title: formTitle, reviewText: formText });
    };

    const config = {
        create: {
            title: "Escribir reseña",
            description: `Comparte tu opinión sobre "${bookTitle}".`,
            button: "Publicar reseña"
        },
        edit: {
            title: "Editar reseña",
            description: `Modifica tu reseña de "${bookTitle}".`,
            button: "Guardar cambios"
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md max-w-[95vw] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="font-display">{config[mode].title}</DialogTitle>
                    <DialogDescription className="font-body text-sm">
                        {config[mode].description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">Calificación</label>
                        <StarRating value={formRating} onChange={setFormRating} />
                    </div>

                    <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">Título (opcional)</label>
                        <Input
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            placeholder="Ej: Una lectura imprescindible"
                            className="font-body w-full min-w-0"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="font-body text-sm text-foreground block">Reseña</label>
                            <span className={`text-[10px] ${formText.length >= 255 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                                {formText.length} / 255
                            </span>
                        </div>
                        <Textarea
                            value={formText}
                            onChange={(e) => setFormText(e.target.value.slice(0, 255))}
                            placeholder="¿Qué te pareció este libro?"
                            rows={4}
                            className={`font-body resize-none w-full min-w-0 break-all ${validationError ? "border-destructive" : ""}`}
                        />
                        {validationError && (
                            <p className="text-[12px] text-destructive mt-1 font-medium italic">
                                {validationError}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="font-body">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onValidateAndSave}
                        disabled={!formText.trim() || isPending}
                        className="font-display"
                    >
                        {isPending ? "Procesando..." : config[mode].button}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
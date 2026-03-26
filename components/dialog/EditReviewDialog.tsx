import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Star } from "lucide-react";
import type { editReviewProps } from "@/lib/definitions";
import { reviewSchema } from "@/schemas/review.schema";
import { useState } from "react";

interface Props {
    editDialogOpen: boolean,
    setEditDialogOpen: (open: boolean) => void;
    bookTitle: string;
    props: editReviewProps
    handleSave: () => void;
    isPending: boolean
}

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => onChange(i + 1)} className="focus:outline-none">
                <Star className={`w-5 h-5 transition-colors ${i < value ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary/50"}`} />
            </button>
        ))}
    </div>
);

export const EditReviewDialog = ({ editDialogOpen, setEditDialogOpen, bookTitle, handleSave, props, isPending }: Props) => {

    const [validationError, setValidationError] = useState<string | null>(null);

    const onValidateAndSave = () => {
        const result = reviewSchema.safeParse({
            title: props.formTitle,
            reviewText: props.formText,
            rating: props.formRating
        });

        if (!result.success) {
            const errorMessage = result.error.issues[0].message;
            setValidationError(errorMessage);
            return;
        }

        setValidationError(null);
        handleSave();
    };

    return (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display">Editar reseña</DialogTitle>
                    <DialogDescription className="font-body text-sm">Modifica tu reseña de "{bookTitle}".</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">Calificación</label>
                        <StarRating value={props.formRating} onChange={props.setFormRating} />
                    </div>
                    <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">Título (opcional)</label>
                        <Input value={props.formTitle} 
                        onChange={(e) => props.setFormTitle(e.target.value)} 
                        placeholder="Ej: Una lectura imprescindible" 
                        className="font-body w-full min-w-0" />
                    </div>
                    <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">Reseña</label>
                        <Textarea value={props.formText} 
                        onChange={(e) => props.setFormText(e.target.value.slice(0, 255))} 
                        placeholder="¿Qué te pareció este libro?" 
                        rows={4} 
                        className="font-body resize-none w-full min-w-0 break-all" />
                        {validationError && (
                            <p className="text-[12px] text-destructive mt-1 font-medium italic">
                                {validationError}
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="font-body">Cancelar</Button>
                    <Button onClick={onValidateAndSave} disabled={!props.formText.trim() || isPending} className="font-display">Guardar cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

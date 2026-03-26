import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"


interface Props {
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    confirmDelete: () => void;
    isPending: boolean
}

export const DeleteReviewDialog = ({ deleteDialogOpen, setDeleteDialogOpen, confirmDelete, isPending }: Props) => {
    return (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-display">Eliminar reseña</DialogTitle>
                    <DialogDescription className="font-body text-sm">
                        ¿Estás seguro de que deseas eliminar tu reseña? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="font-body">Cancelar</Button>
                    <Button variant="destructive" onClick={confirmDelete} disabled={isPending} className="font-display">Eliminar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

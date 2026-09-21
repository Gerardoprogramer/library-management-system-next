"use client";

import { PiTrash } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  isPending: boolean;
}

export const DeleteReviewDialog = ({ deleteDialogOpen, setDeleteDialogOpen, confirmDelete, isPending }: Props) => {
  const handleOpenChange = (open: boolean) => {
    if (isPending && !open) {
      return;
    }

    setDeleteDialogOpen(open);
  };

  return (
    <Dialog open={deleteDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <PiTrash className="size-5" />
          </div>

          <DialogTitle>Eliminar reseña</DialogTitle>

          <DialogDescription>¿Querés eliminar esta reseña? Esta acción no se puede deshacer.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Volver
          </Button>

          <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isPending}>
            <PiTrash />

            {isPending ? "Eliminando..." : "Eliminar reseña"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

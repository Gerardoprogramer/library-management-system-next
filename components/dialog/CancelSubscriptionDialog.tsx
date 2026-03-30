import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Subscription } from '@/lib/definitions';
import { Dispatch, SetStateAction } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface CancelSubscriptionDialogProps {
    sub: Subscription;
    cancelDialog: boolean;
    setCancelDialog: Dispatch<SetStateAction<boolean>>;
    reason: string;
    setReason: Dispatch<SetStateAction<string>>;
    handleCancel: () => void;
}

export const CancelSubscriptionDialog = ({ sub, cancelDialog, setCancelDialog, reason, setReason, handleCancel }: CancelSubscriptionDialogProps) => {
    return (
        <Dialog open={cancelDialog} onOpenChange={(open) => {
            setCancelDialog(open);
            if (!open) setReason("");
        }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-display">Cancelar Suscripción</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="font-body text-sm text-muted-foreground">
                        ¿Estás seguro de cancelar tu suscripción <strong>Plan {sub.planName}</strong>?
                        Perderás acceso a los beneficios al finalizar el período actual.
                    </p>

                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Cuéntanos el motivo
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Ej: Es muy caro, no lo uso..."
                            className="font-body text-sm resize-none"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-4 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={() => { setCancelDialog(false); setReason(""); }}
                        className="font-body"
                    >
                        Mantener
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        className="font-body"
                        disabled={!reason.trim()}
                    >
                        Confirmar cancelación
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

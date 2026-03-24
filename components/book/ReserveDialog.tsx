import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { CalendarClock } from "lucide-react"
import { reserveBook } from "@/lib/definitions"
import { useQuery } from "@tanstack/react-query"
import { reservationService } from "@/services/reservationService"

interface Props {
    reserveDialogOpen: boolean,
    setReserveDialogOpen: (open: boolean) => void
    reserve: reserveBook
}

export const ReserveDialog = ({ reserve, reserveDialogOpen, setReserveDialogOpen }: Props) => {

    const { data: Queue } = useQuery<number>({
        queryKey: ["Queue", reserve.bookId],
        enabled: !!reserve.bookId && reserve.bookId !== 'undefined' && reserveDialogOpen,

        queryFn: () => {
            if (!reserve.bookId) throw new Error("ID no disponible");
            return reservationService.getQueue(reserve.bookId);
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <Dialog open={reserveDialogOpen} onOpenChange={setReserveDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-primary" /> Reservar Libro
                    </DialogTitle>
                    <DialogDescription className="font-body text-sm">
                        No hay copias disponibles de "{reserve.title}". Serás notificado cuando esté disponible.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="bg-muted/50 border border-border rounded-lg p-3">
                        <p className="font-body text-sm text-foreground">
                            Posición estimada en cola: <span className="font-display font-semibold">{Queue ?? 0 + 1}</span>
                        </p>
                    </div>
                    <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">Notas (opcional)</label>
                        <Textarea
                            value={reserve.actionNotes}
                            onChange={(e) => reserve.setActionNotes(e.target.value.slice(0, 500))}
                            placeholder="Notas adicionales..."
                            rows={2}
                            className="font-body resize-none"
                        />
                        <p className="font-body text-xs text-muted-foreground mt-1 text-right">{reserve.actionNotes.length}/500</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setReserveDialogOpen(false)} className="font-body">Cancelar</Button>
                    <Button onClick={reserve.handleReserve} className="font-display gap-2">
                        <CalendarClock className="w-4 h-4" /> Confirmar Reserva
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

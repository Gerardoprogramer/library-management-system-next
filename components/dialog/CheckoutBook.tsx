import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { BookMarked } from "lucide-react"
import { checkoutProps } from "@/lib/definitions"

interface Props {
    checkoutDialogOpen?: boolean,
    setCheckoutDialogOpen: (Open: boolean) => void,
    checkout: checkoutProps,
    isPending: boolean
}

export const CheckoutBook = ({ checkout, checkoutDialogOpen, setCheckoutDialogOpen, isPending }: Props) => {
    return (
        <Dialog
            open={checkoutDialogOpen}
            onOpenChange={() => {
                setCheckoutDialogOpen(false);
                checkout.setActionNotes("")
            }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-primary" /> Solicitar Préstamo
                    </DialogTitle>
                    <DialogDescription className="font-body text-sm">
                        Solicita el préstamo de "{checkout.title}". Tu plan permite hasta {checkout.maxDaysPerBook} días por libro.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">Días de préstamo</label>
                        <Input
                            type="number"
                            min={1}
                            max={checkout.maxDaysPerBook}
                            value={checkout.checkoutDays}
                            onChange={(e) => checkout.setCheckoutDays(Math.max(1, Math.min(checkout.maxDaysPerBook ?? 0, parseInt(e.target.value) || 1)))}
                            className="font-body w-full min-w-0"
                        />
                        <p className="font-body text-xs text-muted-foreground mt-1">
                            Fecha de devolución: {new Date(Date.now() + (checkout.checkoutDays ?? 0) * 86400000).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                    </div>
                    <div>
                        <label className="font-body text-sm text-foreground mb-1.5 block">Notas (opcional)</label>
                        <Textarea
                            value={checkout.actionNotes}
                            onChange={(e) => checkout.setActionNotes(e.target.value.slice(0, 500))}
                            placeholder="Notas adicionales..."
                            rows={2}
                            className="font-body resize-none w-full min-w-0 break-all"
                        />
                        <p className="font-body text-xs text-muted-foreground mt-1 text-right">{checkout.actionNotes.length}/500</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => {
                        setCheckoutDialogOpen(false);
                        checkout.setActionNotes("");
                    }} className="font-body">Cancelar</Button>
                    <Button
                        onClick={checkout.handleCheckout}
                        disabled={isPending}
                        className="font-display gap-2">
                        <BookMarked className="w-4 h-4" /> Confirmar Préstamo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

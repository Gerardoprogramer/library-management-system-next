import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { SubscriptionPlan } from "@/lib/definitions";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface PaymentDialogProps {
    payDialog: boolean;
    setPayDialog: Dispatch<SetStateAction<boolean>>;
    autoRenew: boolean;
    setAutoRenew: Dispatch<SetStateAction<boolean>>;
    selectedPlan?: SubscriptionPlan;
    isLoading: boolean;
    handlePayment: () => void;
}

export const PaymentDialog = ({ payDialog, setPayDialog, autoRenew, setAutoRenew, selectedPlan, isLoading, handlePayment }: PaymentDialogProps) => {

    return (
        <Dialog open={payDialog} onOpenChange={setPayDialog}>
            <DialogContent className="max-w-sm border-none shadow-lg">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl">Confirmar Suscripción</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col items-center py-10 gap-4">
                        <div className="relative">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <CreditCard className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-body font-medium text-foreground">Preparando tu pago</p>
                            <p className="font-body text-xs text-muted-foreground px-6">
                                Estamos generando tu sesión segura en Stripe. No cierres esta ventana.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/50">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Plan Seleccionado</span>
                                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                    {selectedPlan?.durationDays} Días
                                </span>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="font-display text-lg font-bold text-foreground leading-none">{selectedPlan?.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Hasta {selectedPlan?.maxBooksAllowed} libros simultáneos</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-display text-xl font-bold text-foreground">
                                        ${selectedPlan ? (selectedPlan.price / 100).toFixed(2) : "0.00"}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-border/60 my-2" />

                            {/* Opción de Auto-renovación para el CreateSubscriptionRequest */}
                            <div className="flex items-center justify-between py-1">
                                <div className="space-y-0.5">
                                    <Label htmlFor="renew" className="text-sm font-medium">Renovación automática</Label>
                                    <p className="text-[11px] text-muted-foreground italic">Puedes cancelarla en cualquier momento</p>
                                </div>
                                <Switch
                                    id="renew"
                                    checked={autoRenew}
                                    onCheckedChange={setAutoRenew}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2 px-1 text-[11px] font-body text-muted-foreground leading-tight">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span>Al hacer clic en pagar, serás redirigido a la plataforma oficial de Stripe para completar la transacción de forma segura.</span>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="ghost"
                                onClick={() => setPayDialog(false)}
                                className="font-body text-muted-foreground hover:text-foreground"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => handlePayment()}
                                className="font-body gap-2 shadow-md px-6"
                                disabled={isLoading}
                            >
                                <CreditCard className="w-4 h-4" />
                                Pagar Ahora
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/date-utils";
import { Subscription } from "@/lib/definitions";
import { BookOpen, Calendar, Clock, RefreshCw, XCircle } from "lucide-react";
import { CancelSubscriptionDialog } from "../dialog/CancelSubscriptionDialog";
import { useState } from "react";
import { useCancelSubscriptionActions } from "@/hooks/mutations/useCancelSubscriptionActions";

interface SubscriptionCardProps {
    subscription: Subscription
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {

    const [cancelDialog, setCancelDialog] = useState(false);
    const [reason, setReason] = useState("");
    const {mutate: cancelSubscription} = useCancelSubscriptionActions();

    const handleCancel = () => {
        cancelSubscription({reason, id: subscription.id});
        setCancelDialog(false);
    }

    return (
        <Card className={`mb-8 ${subscription?.active && !subscription.daysRemaining ? "border-primary/30" : "border-destructive/30"}`}>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="font-display text-xl font-semibold text-foreground">{subscription?.planName}</h2>
                            <Badge variant={subscription?.active && !subscription.daysRemaining ? "default" : "destructive"}>
                                {subscription?.active && subscription.daysRemaining ? "Activo" : subscription?.daysRemaining === 0 ? "Expirado" : "Cancelado"}
                            </Badge>
                        </div>
                        <p className="font-body text-sm text-muted-foreground">Código: {subscription?.planCode}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-display text-2xl font-bold text-foreground">${(subscription?.price / 100).toFixed(2)}</p>
                        <p className="font-body text-xs text-muted-foreground">/ mes</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-muted/30 rounded-lg p-3">
                        <BookOpen className="w-4 h-4 text-primary mb-1" />
                        <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Máx. libros</p>
                        <p className="font-display text-lg font-semibold text-foreground">{subscription?.maxBooksAllowed}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                        <Clock className="w-4 h-4 text-primary mb-1" />
                        <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Días/libro</p>
                        <p className="font-display text-lg font-semibold text-foreground">{subscription?.maxDaysPerBook}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                        <Calendar className="w-4 h-4 text-primary mb-1" />
                        <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Días restantes</p>
                        <p className={`font-display text-lg font-semibold ${subscription?.daysRemaining <= 5 ? "text-destructive" : "text-foreground"}`}>{subscription?.daysRemaining}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                        <RefreshCw className="w-4 h-4 text-primary mb-1" />
                        <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Auto-renovar</p>
                        <p className="font-display text-lg font-semibold text-foreground">{subscription?.autoRenew ? "Sí" : "No"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-sm font-body text-muted-foreground mb-4">
                    <span>Inicio: {formatDate(subscription?.startDate)}</span>
                    <span>·</span>
                    <span>Fin: {formatDate(subscription?.endDate)}</span>
                    {subscription?.nextBillingDate && (
                        <>
                            <span>·</span>
                            <span>Próximo cobro: {formatDate(subscription?.nextBillingDate)}</span>
                        </>
                    )}
                </div>

                {subscription?.active && subscription.daysRemaining && (
                    <Button
                        onClick={() => setCancelDialog(true)}
                        variant="outline"
                        className="font-body text-sm gap-1.5 text-destructive hover:text-accent-foreground">
                        <XCircle className="w-3.5 h-3.5" /> Cancelar suscripción
                    </Button>
                )}
            </CardContent>

            {
                cancelDialog && (
                    <CancelSubscriptionDialog
                        sub={subscription}
                        cancelDialog={cancelDialog}
                        setCancelDialog={setCancelDialog}
                        handleCancel={handleCancel}
                        reason={reason}
                        setReason={setReason}
                    />
                )
            }
        </Card>
    )
}


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, CreditCard } from "lucide-react";
import { SubscriptionPlan } from "@/lib/definitions";
import { PaymentDialog } from "../dialog/PaymentDialog";
import { useState } from "react";
import { useSubscribeActions } from "@/hooks/mutations/useSubscribeActions";

interface Props {
    plan: SubscriptionPlan;
    isCurrent?: boolean;
}

export const SubscriptionPlanCard = ({ plan, isCurrent }: Props) => {

    const [payDialog, setPayDialog] = useState(false);
    const [autoRenew, setAutoRenew] = useState(true);
    const { isLoading, subscribeMutation } = useSubscribeActions(setPayDialog);


    const handlePayment = () => {
        subscribeMutation.mutate({
            planId: plan.id,
            autoRenew,
            notes: `Suscripción al plan ${plan.name}`
        });
    }

    return (
        <Card className={`relative ${isCurrent ? "border-primary ring-1 ring-primary/20" : ""} ${plan.featured ? "shadow-lg" : ""}`}>
            {plan.badgeText && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge className="font-body text-xs">{plan.badgeText}</Badge>
                </div>
            )}
            <CardContent className="p-5 pt-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">{plan.description}</p>
                <p className="font-display text-3xl font-bold text-foreground mb-4">
                    ${(plan.price / 100).toFixed(2)}
                    <span className="font-body text-sm font-normal text-muted-foreground">/mes</span>
                </p>
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Hasta {plan.maxBooksAllowed} libros simultáneos
                    </div>
                    <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {plan.maxDaysPerBook} días por libro
                    </div>
                    <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {plan.durationDays} días de duración
                    </div>
                </div>
                <Button
                    onClick={() => setPayDialog(true)}
                    className="w-full font-body gap-1.5" variant={isCurrent ? "secondary" : "default"}>
                    {isCurrent ? "Plan actual" : <><CreditCard className="w-4 h-4" /> Seleccionar</>}
                </Button>
            </CardContent>

            <PaymentDialog
                payDialog={payDialog}
                setPayDialog={setPayDialog}
                selectedPlan={plan}
                isLoading={isLoading}
                handlePayment={handlePayment}
                autoRenew={autoRenew}
                setAutoRenew={setAutoRenew}
            />
        </Card>
    )
}

'use client';

import { SubscriptionCard } from "@/components/cards/SubscriptionCard";
import { SubscriptionPlanCard } from "@/components/cards/SubscriptionPlanCard";
import { SubscriptionCardSkeleton, SubscriptionPlanCardSkeleton } from "@/components/custom/skeletons";
import { usePlanSubscription } from "@/hooks/queries/usePlanSubscription";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { Crown } from "lucide-react";

export default function SubscriptionPage() {
  const { data: subscriptionPlans, isLoading: isPlansLoading } = usePlanSubscription();
  const { data: subscription, isLoading: isSubscriptionLoading } = useSubscription();


  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Crown className="w-7 h-7 text-primary" />
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">Mi Suscripción</h1>
      </div>
      <p className="font-body text-lg text-muted-foreground mb-8">Gestiona tu plan de biblioteca</p>

      {isSubscriptionLoading ? (
        <SubscriptionCardSkeleton />
      ) : subscription ? (
        <SubscriptionCard subscription={subscription} />
      ) : (
        <div className="p-4 border rounded-lg bg-muted/20 text-center mb-4">
          <p className="text-muted-foreground">No tienes una suscripción activa actualmente.</p>
        </div>
      )}

      <h2 className="font-display text-xl font-semibold text-foreground mb-4">Planes disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isPlansLoading ?
          Array.from({ length: 3 }).map((_, i) => (
            <SubscriptionPlanCardSkeleton key={i} />
          ))
          : subscriptionPlans?.content.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isCurrent={subscription?.active && plan.planCode === subscription.planCode}
            />
          ))}
      </div>
    </div>
  );
}
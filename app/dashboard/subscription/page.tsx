"use client";

import { PiCrown, PiCreditCard } from "react-icons/pi";

import { SubscriptionCard } from "@/components/cards/SubscriptionCard";
import { SubscriptionPlanCard } from "@/components/cards/SubscriptionPlanCard";
import { SubscriptionCardSkeleton, SubscriptionPlanCardSkeleton } from "@/components/custom/skeletons";
import { usePlanSubscription } from "@/hooks/queries/usePlanSubscription";
import { useSubscription } from "@/hooks/queries/useSubscription";

export default function SubscriptionPage() {
  const { data: subscriptionPlans, isLoading: isPlansLoading } = usePlanSubscription();

  const { data: subscription, isLoading: isSubscriptionLoading } = useSubscription();

  const plans = subscriptionPlans?.content ?? [];

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiCrown className="size-4.5" />
          </div>

          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Membresía</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Mi suscripción</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Consultá tu plan actual, revisá sus beneficios y administrá tu suscripción a la biblioteca.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Plan actual</h2>

          <p className="mt-1 text-sm text-muted-foreground">Estado y condiciones de tu membresía.</p>
        </div>

        {isSubscriptionLoading ? (
          <SubscriptionCardSkeleton />
        ) : subscription ? (
          <SubscriptionCard subscription={subscription} />
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <PiCreditCard className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground">No tenés una suscripción activa</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Elegí uno de los planes disponibles para acceder a préstamos y beneficios de la biblioteca.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="border-b border-border/60 pb-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Planes disponibles</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Compará duración, capacidad de préstamos y condiciones antes de elegir un plan.
          </p>
        </div>

        {isPlansLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SubscriptionPlanCardSkeleton key={index} />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <PiCrown className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground">No hay planes disponibles</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Actualmente no hay planes de suscripción disponibles para contratar.
            </p>
          </div>
        ) : (
          <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                isCurrent={Boolean(
                  subscription?.active && !subscription.expired && plan.planCode === subscription.planCode
                )}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

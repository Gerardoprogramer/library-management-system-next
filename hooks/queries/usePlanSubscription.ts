import { useQuery } from "@tanstack/react-query";
import { SubscriptionPlanService } from "@/services/subscriptionPlanService";
import type { PageResponse, SubscriptionPlan } from "@/lib/definitions";

export const usePlanSubscription = () => {
    return useQuery<PageResponse<SubscriptionPlan>>({
        queryKey: ["subscription-plans"],
        queryFn: () => SubscriptionPlanService.subscriptionPlans(),
        staleTime: 1000 * 60 * 5,
    });
};
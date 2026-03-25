import { useQuery } from "@tanstack/react-query";
import { SubscriptionService } from "@/services/SubscriptionService";
import type { Subscription } from "@/lib/definitions";

export const useSubscription = () => {
    return useQuery<Subscription>({
        queryKey: ["subscription"],
        queryFn: () => SubscriptionService.subscription(),
        staleTime: 1000 * 60 * 5,
    });
};
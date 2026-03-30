import { SubscriptionService } from "@/services/SubscriptionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCancelSubscriptionActions = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reason, id }: { reason: string; id: string }) =>
            SubscriptionService.cancelSubscription(reason, id),
        onSuccess: (updatedSub) => {
            queryClient.setQueryData(['subscription'], updatedSub);
        }
    });
}

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import type { Subscription } from "@/lib/definitions";
import { SubscriptionService } from "@/services/subscriptionService";

export const useSubscription = () => {
  return useQuery<Subscription | null>({
    queryKey: ["subscription"],

    queryFn: async () => {
      try {
        return await SubscriptionService.subscription();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },

    staleTime: 1000 * 60 * 5,
  });
};

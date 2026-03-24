import { api } from "@/lib/axios";
import type { ApiResponse, Subscription } from "@/lib/definitions";

export const SubscriptionService = {

    subscription: async (): Promise<Subscription> => {
        const response = await api.get<ApiResponse<Subscription>>("/subscription");

        if (!response.data.data) {
            throw new Error("El usuario no tiene subscripción");
        }

        return response.data.data;
    },
};

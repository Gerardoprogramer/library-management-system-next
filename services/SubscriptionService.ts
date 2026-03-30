import { api } from "@/lib/axios";
import type { ApiResponse, Subscription, SubscriptionPostResponse } from "@/lib/definitions";

export const SubscriptionService = {

    subscription: async (): Promise<Subscription> => {
        const response = await api.get<ApiResponse<Subscription>>("/subscription");

        if (!response.data.data) {
            throw new Error("El usuario no tiene subscripción");
        }

        return response.data.data;
    },

    cancelSubscription: async (reason: string, id: string): Promise<Subscription> => {
        const response = await api.patch<ApiResponse<Subscription>>(`/subscription/${id}`, { reason });

        if (!response.data.data) {
            throw new Error("El usuario no tiene subscripción");
        }

        return response.data.data;
    },

    subscribeToPlan: async (subscriptionPlanId: string, autoRenew: boolean, notes: string): Promise<SubscriptionPostResponse> => {
        const response = await api.post<ApiResponse<SubscriptionPostResponse>>("/subscription", {
            subscriptionPlanId,
            autoRenew,
            notes
        });

        if (!response.data.data) {
            throw new Error("No se pudo crear la subscripción");
        }

        return response.data.data;
    }
};

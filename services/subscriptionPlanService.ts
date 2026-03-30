import { api } from "@/lib/axios";
import type { ApiResponse, PageResponse, SubscriptionPlan } from "@/lib/definitions";

export const SubscriptionPlanService = {

    subscriptionPlans: async (): Promise<PageResponse<SubscriptionPlan>> => {
        const response = await api.get<ApiResponse<PageResponse<SubscriptionPlan>>>("/subscription-plan");

        if (!response.data.data) {
            throw new Error("No hay planes de suscripción disponibles en este momento.");
        }

        return response.data.data;
    },
};

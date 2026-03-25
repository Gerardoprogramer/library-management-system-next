import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loansService } from "@/services/loansService";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast-utils";
import type { checkoutLoan } from "@/lib/definitions";

export const useLoanActions = (bookId: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const checkout = useMutation({
        mutationFn: (newLoan: checkoutLoan) => loansService.checkout(newLoan),
        onSuccess: (res) => {
            showToast.success("¡Préstamo exitoso!", res.message, {
                label: "Mis Libros",
                onClick: () => router.push("/dashboard/loans"),
            });
            queryClient.invalidateQueries({ queryKey: ["loans"] });
            queryClient.invalidateQueries({ queryKey: ["book", bookId] });
        },
        onError: (error) => showToast.apiError(error)
    });

    return {
        performCheckout: checkout.mutate,
        isPending: checkout.isPending
    };
};
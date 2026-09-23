"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { AdminNav, AdminPage, AdminSection } from "@/components/admin/AdminTools";
import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { adminService } from "@/services/adminService";

export default function AdminPaymentsPage() {
  const [paymentIdToRefund, setPaymentIdToRefund] = useState<string | null>(null);
  const refund = useMutation({
    mutationFn: (paymentId: string) => adminService.refundPayment(paymentId),
  });

  return (
    <AdminPage title="Pagos y reembolsos" description="Procesa reembolsos de transacciones confirmadas.">
      <AdminNav />
      <AdminActionDialog
        open={Boolean(paymentIdToRefund)}
        onOpenChange={(open) => !open && setPaymentIdToRefund(null)}
        title="Confirmar reembolso"
        description="El reembolso procesará la transacción en el proveedor de pagos."
        confirmLabel="Procesar reembolso"
        onConfirm={() => {
          if (paymentIdToRefund) refund.mutate(paymentIdToRefund);
          setPaymentIdToRefund(null);
        }}
      />
      <AdminSection
        title="Solicitar reembolso"
        description="Solo se aceptan identificadores UUID de pagos completados."
      >
        <form
          className="max-w-xl space-y-5 p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            const paymentId = new FormData(event.currentTarget).get("paymentId")?.toString().trim() ?? "";
            if (paymentId) setPaymentIdToRefund(paymentId);
          }}
        >
          <label className="block space-y-2 text-sm">
            <span className="font-medium">ID del pago</span>
            <input
              name="paymentId"
              required
              pattern="^[0-9a-fA-F-]{36}$"
              title="Introduce un UUID válido"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          {refund.isError && (
            <p role="alert" className="text-sm text-destructive">
              {(refund.error as Error).message}
            </p>
          )}
          {refund.isSuccess && (
            <p role="status" className="text-sm text-emerald-600">
              Reembolso procesado correctamente.
            </p>
          )}
          <button
            disabled={refund.isPending}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm disabled:opacity-50"
          >
            {refund.isPending ? "Procesando..." : "Solicitar reembolso"}
          </button>
        </form>
      </AdminSection>
    </AdminPage>
  );
}

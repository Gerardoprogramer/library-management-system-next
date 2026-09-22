"use client";
import { useState } from "react";
import { adminService } from "@/services/adminService";
import { AdminNav, AdminPage, AdminSection } from "@/components/admin/AdminTools";
export default function AdminPaymentsPage() {
  const [paymentId, setPaymentId] = useState("");
  const [message, setMessage] = useState("");
  const refund = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); try { await adminService.refundPayment(paymentId); setMessage("Reembolso solicitado correctamente."); } catch (error) { setMessage((error as Error).message); } };
  return <AdminPage title="Pagos y reembolsos" description="Procesá reembolsos de transacciones confirmadas.">
    <AdminNav />
    <AdminSection title="Solicitar reembolso" description="Introduce el identificador de una transacción confirmada para iniciar el proceso.">
      <form onSubmit={refund} className="max-w-xl space-y-5 p-5 sm:p-6">
        <label className="block space-y-2 text-sm"><span className="font-medium">ID del pago</span><input required value={paymentId} onChange={(event) => setPaymentId(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
        <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-105">Solicitar reembolso</button>
        {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
      </form>
    </AdminSection>
  </AdminPage>;
}

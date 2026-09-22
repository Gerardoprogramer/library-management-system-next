"use client";
import { useState } from "react";
import { adminService } from "@/services/adminService";
import { AdminNav, AdminPage } from "@/components/admin/AdminTools";
export default function AdminPaymentsPage() {
  const [paymentId, setPaymentId] = useState("");
  const [message, setMessage] = useState("");
  const refund = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); try { await adminService.refundPayment(paymentId); setMessage("Reembolso solicitado correctamente."); } catch (error) { setMessage((error as Error).message); } };
  return <AdminPage title="Pagos y reembolsos" description="Procesá reembolsos de transacciones confirmadas."><AdminNav /><form onSubmit={refund} className="max-w-xl space-y-4 rounded-2xl border border-border/70 bg-card p-5"><label className="block space-y-1 text-sm"><span className="font-medium">ID del pago</span><input required value={paymentId} onChange={(event) => setPaymentId(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></label><button className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Solicitar reembolso</button>{message && <p className="text-sm text-muted-foreground">{message}</p>}</form></AdminPage>;
}

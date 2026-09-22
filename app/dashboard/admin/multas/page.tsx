"use client";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { AdminForm, AdminNav, AdminPage, Field } from "@/components/admin/AdminTools";
export default function AdminFinesPage() {
  const fines = useQuery({ queryKey: ["admin", "fines"], queryFn: () => adminService.fines({ page: 0, size: 50 }) });
  return <AdminPage title="Multas" description="Creá multas y aplicá exenciones con trazabilidad."><AdminNav /><AdminForm onSubmit={(v) => adminService.createFine({ ...v, amount: Number(v.amount) })}><Field name="userId" label="ID de usuario" required /><Field name="bookLoanId" label="ID de préstamo" /><Field name="type" label="Tipo (OVERDUE, DAMAGE, LOSS, PROCESSING)" required /><Field name="amount" label="Importe" type="number" required /><Field name="reason" label="Motivo" required /><Field name="notes" label="Notas" /></AdminForm><section className="rounded-2xl border border-border/70 bg-card">{fines.isLoading ? <p className="p-5 text-sm text-muted-foreground">Cargando...</p> : fines.data?.content.map((fine) => <div key={fine.id} className="flex justify-between border-b border-border/60 px-5 py-4 text-sm last:border-0"><span>{fine.reason}</span><span className="text-muted-foreground">{fine.amount} {fine.currency} · {fine.status}</span></div>)}</section></AdminPage>;
}

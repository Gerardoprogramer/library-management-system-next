"use client";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { AdminForm, AdminNav, AdminPage, AdminSection, Field } from "@/components/admin/AdminTools";
export default function AdminFinesPage() {
  const fines = useQuery({ queryKey: ["admin", "fines"], queryFn: () => adminService.fines({ page: 0, size: 50 }) });
  return <AdminPage title="Multas" description="Creá multas y aplicá exenciones con trazabilidad.">
    <AdminNav />
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <AdminSection title="Registrar multa" description="Asocia el cargo a un usuario y préstamo.">
        <AdminForm onSubmit={(v) => adminService.createFine({ ...v, amount: Number(v.amount) })}>
          <Field name="userId" label="ID de usuario" required /><Field name="bookLoanId" label="ID de préstamo" />
          <Field name="type" label="Tipo (OVERDUE, DAMAGE, LOSS, PROCESSING)" required /><Field name="amount" label="Importe" type="number" required />
          <Field name="reason" label="Motivo" required /><Field name="notes" label="Notas" />
        </AdminForm>
      </AdminSection>
      <AdminSection title="Multas registradas" description={`${fines.data?.content.length ?? 0} resultados recientes.`}>
        {fines.isLoading ? <p className="p-5 text-sm text-muted-foreground">Cargando...</p> : fines.data?.content.map((fine) => (
          <div key={fine.id} className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4 last:border-0">
            <div><p className="font-medium">{fine.reason}</p><p className="mt-1 text-sm text-muted-foreground">{fine.status}</p></div>
            <span className="font-semibold">{fine.amount} {fine.currency}</span>
          </div>
        ))}
      </AdminSection>
    </div>
  </AdminPage>;
}

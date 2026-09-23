"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { AdminForm, AdminNav, AdminPage, AdminSection, Field } from "@/components/admin/AdminTools";
import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { adminService } from "@/services/adminService";
import type { Fine, FineStatus } from "@/lib/definitions";

export default function AdminFinesPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState<FineStatus | "">("");
  const [userId, setUserId] = useState("");
  const [waivingFineId, setWaivingFineId] = useState<string | null>(null);
  const fines = useQuery({
    queryKey: ["admin", "fines", status, userId],
    queryFn: () =>
      adminService.fines({ page: 0, size: 50, ...(status ? { status } : {}), ...(userId ? { userId } : {}) }),
  });
  const waive = useMutation({
    mutationFn: ({ fineId, reason }: { fineId: string; reason: string }) => adminService.waiveFine({ fineId, reason }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "fines"] }),
  });

  return (
    <AdminPage title="Multas" description="Registra cargos, consulta su estado y aplica exenciones con trazabilidad.">
      <AdminNav />
      <AdminActionDialog
        open={Boolean(waivingFineId)}
        onOpenChange={(open) => !open && setWaivingFineId(null)}
        title="Eximir multa"
        description="Registra el motivo de la exención para mantener trazabilidad administrativa."
        confirmLabel="Eximir multa"
        inputLabel="Motivo"
        inputPlaceholder="Describe el motivo"
        validate={(value) => value.trim().length > 0}
        onConfirm={(reason) => {
          if (waivingFineId) waive.mutate({ fineId: waivingFineId, reason: reason.trim() });
          setWaivingFineId(null);
        }}
      />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <AdminSection title="Registrar multa" description="Todos los campos requeridos coinciden con el backend.">
          <AdminForm
            onSubmit={(values) =>
              adminService.createFine({
                ...values,
                amount: Number(values.amount),
                currency: values.currency as "USD" | "CRC" | "EUR",
              })
            }
          >
            <Field name="userId" label="ID de usuario" required />
            <Field name="bookLoanId" label="ID de préstamo" required />
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Tipo</span>
              <select name="type" required className="h-11 w-full rounded-xl border border-input bg-background px-3">
                <option value="">Selecciona un tipo</option>
                <option value="OVERDUE">Atraso</option>
                <option value="DAMAGE">Daño</option>
                <option value="LOSS">Pérdida</option>
                <option value="PROCESSING">Gestión</option>
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="amount" label="Importe" type="number" required />
              <label className="block space-y-2 text-sm">
                <span className="font-medium">Moneda</span>
                <select
                  name="currency"
                  required
                  defaultValue="USD"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3"
                >
                  <option>USD</option>
                  <option>CRC</option>
                  <option>EUR</option>
                </select>
              </label>
            </div>
            <Field name="reason" label="Motivo" required />
            <Field name="notes" label="Notas" />
          </AdminForm>
        </AdminSection>
        <AdminSection
          title="Multas registradas"
          description={`${fines.data?.totalElements ?? 0} resultados.`}
          action={
            <div className="flex gap-2">
              <select
                aria-label="Filtrar estado"
                value={status}
                onChange={(event) => setStatus(event.target.value as FineStatus | "")}
                className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="PAID">Pagadas</option>
                <option value="WAIVED">Eximidas</option>
              </select>
              <input
                aria-label="Filtrar por usuario"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="ID usuario"
                className="h-9 w-28 rounded-lg border border-input bg-background px-2 text-sm"
              />
            </div>
          }
        >
          {fines.isLoading && <p className="p-5 text-sm text-muted-foreground">Cargando multas...</p>}
          {fines.isError && (
            <p role="alert" className="p-5 text-sm text-destructive">
              No se pudieron cargar las multas.
            </p>
          )}
          {!fines.isLoading && !fines.data?.content.length && (
            <p className="p-5 text-sm text-muted-foreground">No hay multas con esos filtros.</p>
          )}
          {fines.data?.content.map((fine: Fine) => (
            <div key={fine.id} className="border-b border-border/60 px-5 py-4 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{fine.reason || fine.type}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {fine.status} · Usuario {fine.userId}
                  </p>
                </div>
                <span className="font-semibold">
                  {fine.amount} {fine.currency}
                </span>
              </div>
              {fine.status === "PENDING" && (
                <button
                  type="button"
                  onClick={() => setWaivingFineId(fine.id)}
                  className="mt-3 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  Eximir multa
                </button>
              )}
            </div>
          ))}
        </AdminSection>
      </div>
    </AdminPage>
  );
}

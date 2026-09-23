"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { AdminForm, AdminNav, AdminPage, AdminPagination, AdminSection, Field } from "@/components/admin/AdminTools";
import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { adminService } from "@/services/adminService";
import type { Fine, FineStatus } from "@/lib/definitions";
import { adminFineSchema } from "@/schemas/admin.schema";

export default function AdminFinesPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState<FineStatus | "">("");
  const [filterUserId, setFilterUserId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [page, setPage] = useState(0);
  const [waivingFineId, setWaivingFineId] = useState<string | null>(null);

  const users = useQuery({
    queryKey: ["admin", "users", "fine-options"],
    queryFn: adminService.users,
  });

  const userLoans = useQuery({
    queryKey: ["admin", "loans", "fine-options", selectedUserId],
    queryFn: () =>
      adminService.searchLoans({
        userId: selectedUserId,
        page: 0,
        size: 100,
      }),
    enabled: Boolean(selectedUserId),
  });
  const fines = useQuery({
    queryKey: ["admin", "fines", status, filterUserId, page],
    queryFn: () =>
      adminService.fines({
        page,
        size: 10,
        ...(status ? { status } : {}),
        ...(filterUserId ? { userId: filterUserId } : {}),
      }),
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
            onSubmit={async (values) => {
              const result = adminFineSchema.safeParse({
                userId: values.userId,
                bookLoanId: values.bookLoanId,
                type: values.type,
                amount: Number(values.amount),
                currency: values.currency,
                reason: values.reason || undefined,
                notes: values.notes || undefined,
              });

              if (!result.success) {
                throw new Error(result.error.issues[0]?.message ?? "Los datos de la multa no son válidos");
              }

              await adminService.createFine(result.data);

              await client.invalidateQueries({
                queryKey: ["admin", "fines"],
              });

              setSelectedUserId("");
              setSelectedLoanId("");
            }}
          >
            <label className="block space-y-2 text-sm">
              <span className="font-medium">
                Usuario<span className="ml-1 text-primary">*</span>
              </span>

              <select
                name="userId"
                required
                value={selectedUserId}
                disabled={users.isLoading}
                onChange={(event) => {
                  setSelectedUserId(event.target.value);
                  setSelectedLoanId("");
                }}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 disabled:opacity-50"
              >
                <option value="">{users.isLoading ? "Cargando usuarios..." : "Selecciona un usuario"}</option>

                {users.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} · {user.email}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium">
                Préstamo<span className="ml-1 text-primary">*</span>
              </span>

              <select
                name="bookLoanId"
                required
                value={selectedLoanId}
                disabled={!selectedUserId || userLoans.isLoading}
                onChange={(event) => setSelectedLoanId(event.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 disabled:opacity-50"
              >
                <option value="">
                  {!selectedUserId
                    ? "Selecciona primero un usuario"
                    : userLoans.isLoading
                      ? "Cargando préstamos..."
                      : "Selecciona un préstamo"}
                </option>

                {userLoans.data?.content.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.bookTitle} · {loan.status}
                  </option>
                ))}
              </select>

              {selectedUserId && userLoans.isSuccess && userLoans.data?.content.length === 0 && (
                <p className="text-sm text-muted-foreground">Este usuario no tiene préstamos registrados.</p>
              )}

              {userLoans.isError && (
                <p role="alert" className="text-sm text-destructive">
                  No se pudieron cargar los préstamos del usuario.
                </p>
              )}
            </label>
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
              <Field name="amount" label="Importe" type="number" min={0.01} step={0.01} required />
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
            <Field name="reason" label="Motivo" />
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
                onChange={(event) => {
                  setStatus(event.target.value as FineStatus | "");
                  setPage(0);
                }}
                className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="PARTIALLY_PAID">Parcialmente pagadas</option>
                <option value="PAID">Pagadas</option>
                <option value="WAIVED">Eximidas</option>
              </select>
              <select
                aria-label="Filtrar por usuario"
                value={filterUserId}
                onChange={(event) => {
                  setFilterUserId(event.target.value);
                  setPage(0);
                }}
                className="h-9 max-w-56 rounded-lg border border-input bg-background px-2 text-sm"
              >
                <option value="">Todos los usuarios</option>

                {users.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
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
                    {fine.status} · {users.data?.find((user) => user.id === fine.userId)?.fullName ?? "Usuario"}
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
          {fines.data && (
            <AdminPagination
              page={page}
              totalPages={fines.data.totalPages}
              totalElements={fines.data.totalElements}
              onPageChange={setPage}
            />
          )}
        </AdminSection>
      </div>
    </AdminPage>
  );
}

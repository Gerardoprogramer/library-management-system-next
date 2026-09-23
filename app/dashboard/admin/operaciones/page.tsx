"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { AdminForm, AdminNav, AdminPage, AdminPagination, AdminSection, Field } from "@/components/admin/AdminTools";
import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { adminService } from "@/services/adminService";
import { bookService } from "@/services/bookService";
import type { meLoans, reservationBook } from "@/lib/definitions";

export default function AdminOperationsPage() {
  const client = useQueryClient();
  const [reservationUserId, setReservationUserId] = useState("");
  const [loansPage, setLoansPage] = useState(0);
  const [reservationsPage, setReservationsPage] = useState(0);
  const [fulfillingReservationId, setFulfillingReservationId] = useState<string | null>(null);
  const users = useQuery({
    queryKey: ["admin", "users", "checkout-options"],
    queryFn: adminService.users,
  });
  const books = useQuery({
    queryKey: ["admin", "books", "checkout-options"],
    queryFn: () => bookService.search({ page: 0, size: 100, availableOnly: true }),
  });
  const loans = useQuery({
    queryKey: ["admin", "loans", loansPage],
    queryFn: () => adminService.searchLoans({ page: loansPage, size: 10 }),
  });
  const reservations = useQuery({
    queryKey: ["admin", "reservations", reservationUserId, reservationsPage],
    queryFn: () => adminService.reservations({ userId: reservationUserId, page: reservationsPage, size: 10 }),
    enabled: Boolean(reservationUserId),
  });
  const update = useMutation({
    mutationFn: adminService.updateOverdueLoans,
    onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "loans"] }),
  });
  const fulfill = useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => adminService.fulfillReservation(id, days),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["admin", "reservations"] });
      client.invalidateQueries({ queryKey: ["admin", "loans"] });
    },
  });

  return (
    <AdminPage
      title="Préstamos y reservas"
      description="Busca operaciones, asigna préstamos y atiende reservas pendientes."
    >
      <AdminNav />
      <AdminActionDialog
        open={Boolean(fulfillingReservationId)}
        onOpenChange={(open) => !open && setFulfillingReservationId(null)}
        title="Convertir reserva en préstamo"
        description="Define cuántos días tendrá el préstamo para esta reserva disponible."
        confirmLabel="Convertir en préstamo"
        inputLabel="Días de préstamo"
        inputType="number"
        defaultValue="14"
        validate={(value) => Number(value) > 0}
        onConfirm={(value) => {
          if (fulfillingReservationId) {
            fulfill.mutate({ id: fulfillingReservationId, days: Number(value) });
          }
          setFulfillingReservationId(null);
        }}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => update.mutate()}
          disabled={update.isPending}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-105 disabled:opacity-50"
        >
          {update.isPending ? "Actualizando..." : "Actualizar vencidos"}
        </button>
      </div>
      <AdminSection title="Registrar préstamo" description="Asigna un libro directamente a un usuario.">
        <AdminForm
          onSubmit={(values) =>
            adminService.checkoutForUser(values.userId, {
              bookId: values.bookId,
              checkoutDays: Number(values.checkoutDays),
              notes: values.notes,
            })
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Usuario</span>
              <select
                name="userId"
                required
                defaultValue=""
                className="h-11 w-full rounded-xl border border-input bg-background/70 px-3"
              >
                <option value="" disabled>
                  {users.isLoading ? "Cargando usuarios..." : "Selecciona un usuario"}
                </option>
                {users.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} · {user.email}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Libro disponible</span>
              <select
                name="bookId"
                required
                defaultValue=""
                className="h-11 w-full rounded-xl border border-input bg-background/70 px-3"
              >
                <option value="" disabled>
                  {books.isLoading ? "Cargando libros..." : "Selecciona un libro"}
                </option>
                {books.data?.content.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} · {book.author}
                  </option>
                ))}
              </select>
            </label>
            <Field name="checkoutDays" label="Días de préstamo" type="number" required />
            <Field name="notes" label="Notas" />
          </div>
          {(users.isError || books.isError) && (
            <p role="alert" className="text-sm text-destructive">
              No se pudieron cargar las opciones de usuarios o libros.
            </p>
          )}
        </AdminForm>
      </AdminSection>
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminSection title="Préstamos recientes" description={`${loans.data?.totalElements ?? 0} resultados`}>
          {loans.isLoading && <p className="p-5 text-sm text-muted-foreground">Cargando préstamos...</p>}
          {loans.data?.content.map((loan: meLoans) => (
            <div key={loan.id} className="border-b border-border/60 px-5 py-4 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{loan.bookTitle}</p>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{loan.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {loan.userName} · Vence {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "sin fecha"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {loan.overdue
                  ? `${loan.overdueDays} días de atraso · Multa ${loan.fineAmount}`
                  : `${loan.remainingDays ?? 0} días restantes`}
              </p>
            </div>
          ))}
          {loans.data && (
            <AdminPagination
              page={loansPage}
              totalPages={loans.data.totalPages}
              totalElements={loans.data.totalElements}
              onPageChange={setLoansPage}
            />
          )}
        </AdminSection>
        <AdminSection title="Reservas" description="Indica un usuario para consultar sus reservas.">
          <form
            className="flex gap-2 border-b border-border/60 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              setReservationUserId(new FormData(event.currentTarget).get("userId")?.toString().trim() ?? "");
              setReservationsPage(0);
            }}
          >
            <select
              name="userId"
              required
              defaultValue=""
              className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="" disabled>
                {users.isLoading ? "Cargando usuarios..." : "Selecciona un usuario"}
              </option>
              {users.data?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} · {user.email}
                </option>
              ))}
            </select>
            <button className="rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">Buscar</button>
          </form>
          {!reservationUserId && (
            <p className="p-5 text-sm text-muted-foreground">Introduce un ID de usuario para ver sus reservas.</p>
          )}
          {reservations.isLoading && <p className="p-5 text-sm text-muted-foreground">Cargando reservas...</p>}
          {reservations.data?.content.map((reservation: reservationBook) => (
            <div key={reservation.id} className="border-b border-border/60 px-5 py-4 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{reservation.bookTitle}</p>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {reservation.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Posición en cola: {reservation.queuePosition}</p>
              {reservation.status === "AVAILABLE" && (
                <button
                  type="button"
                  onClick={() => setFulfillingReservationId(reservation.id)}
                  className="mt-3 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  Convertir en préstamo
                </button>
              )}
            </div>
          ))}
          {reservations.data && (
            <AdminPagination
              page={reservationsPage}
              totalPages={reservations.data.totalPages}
              totalElements={reservations.data.totalElements}
              onPageChange={setReservationsPage}
            />
          )}
        </AdminSection>
      </div>
    </AdminPage>
  );
}

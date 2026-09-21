"use client";

import { PiCreditCard, PiFunnel, PiReceipt, PiWarningCircle } from "react-icons/pi";

import { FineCard } from "@/components/cards/FineCard";
import { PaymentCard } from "@/components/cards/PaymentCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { Badge } from "@/components/ui/badge";
import { usePayFine } from "@/hooks/mutations/usePayFine";
import { useFines } from "@/hooks/queries/useFines";
import { usePaymentHistory } from "@/hooks/queries/usePaymentHistory";

const fineStatusOptions = [
  { id: "PENDING", name: "Pendientes" },
  {
    id: "PARTIALLY_PAID",
    name: "Pago parcial",
  },
  { id: "PAID", name: "Pagadas" },
  { id: "WAIVED", name: "Eximidas" },
];

const fineTypeOptions = [
  { id: "OVERDUE", name: "Atraso" },
  { id: "DAMAGE", name: "Daño" },
  { id: "LOSS", name: "Pérdida" },
  {
    id: "PROCESSING",
    name: "Procesamiento",
  },
];

export default function PayPage() {
  const { fines, status, type, isLoading: finesLoading, setStatus, setType } = useFines();

  const { payments, isLoading: paymentsLoading } = usePaymentHistory();

  const { payFine, isPaying, payingFineId } = usePayFine();

  const fineTotal = fines?.totalElements ?? 0;

  const paymentTotal = payments?.totalElements ?? 0;

  const selectedStatusLabel =
    status === "all" ? "Todos" : (fineStatusOptions.find((option) => option.id === status)?.name ?? "Todos");

  const selectedTypeLabel =
    type === "all" ? "Todos" : (fineTypeOptions.find((option) => option.id === type)?.name ?? "Todos");

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiCreditCard className="size-4.5" />
          </div>

          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Cuenta y pagos</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Pagos y multas</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Consultá tus multas, pagá saldos pendientes mediante Stripe y revisá el historial de transacciones de tu
          cuenta.
        </p>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-5 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PiWarningCircle className="size-5 text-muted-foreground" />

              <h2 className="text-lg font-semibold tracking-tight text-foreground">Multas</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {finesLoading
                ? "Cargando multas..."
                : fineTotal === 0
                  ? "Sin resultados"
                  : fineTotal === 1
                    ? "1 multa"
                    : `${fineTotal} multas`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PiFunnel className="size-4" />
              <span>Filtros</span>
            </div>

            <CustomSelect
              headline="Todos los estados"
              options={fineStatusOptions}
              selectedItem={status}
              setSelectedItem={setStatus}
            />

            <CustomSelect
              headline="Todos los tipos"
              options={fineTypeOptions}
              selectedItem={type}
              setSelectedItem={setType}
            />
          </div>
        </div>

        {(status !== "all" || type !== "all") && (
          <div className="flex flex-wrap items-center gap-2">
            {status !== "all" && <Badge variant="secondary">Estado: {selectedStatusLabel}</Badge>}

            {type !== "all" && <Badge variant="outline">Tipo: {selectedTypeLabel}</Badge>}
          </div>
        )}

        {finesLoading ? (
          <div className="space-y-4">
            <div className="h-44 animate-pulse rounded-2xl bg-muted" />
            <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          </div>
        ) : fineTotal === 0 ? (
          <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <PiWarningCircle className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground">No hay multas</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {status !== "all" || type !== "all"
                ? "No encontramos multas que coincidan con los filtros seleccionados."
                : "Actualmente no tenés multas registradas en tu cuenta."}
            </p>
          </section>
        ) : (
          <div className="space-y-4">
            {fines?.content.map((fine) => (
              <FineCard key={fine.id} fine={fine} onPay={payFine} isPaying={isPaying} payingFineId={payingFineId} />
            ))}
          </div>
        )}

        {fines && fines.totalPages > 1 && (
          <div className="flex justify-center pt-2">
            <CustomPagination totalPages={fines.totalPages} paramName="FinePage" />
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="border-b border-border/60 pb-5">
          <div className="flex items-center gap-2">
            <PiReceipt className="size-5 text-muted-foreground" />

            <h2 className="text-lg font-semibold tracking-tight text-foreground">Historial de pagos</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {paymentsLoading
              ? "Cargando historial..."
              : paymentTotal === 0
                ? "Sin transacciones"
                : paymentTotal === 1
                  ? "1 transacción"
                  : `${paymentTotal} transacciones`}
          </p>
        </div>

        {paymentsLoading ? (
          <div className="space-y-4">
            <div className="h-40 animate-pulse rounded-2xl bg-muted" />
            <div className="h-40 animate-pulse rounded-2xl bg-muted" />
          </div>
        ) : paymentTotal === 0 ? (
          <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <PiReceipt className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground">Sin historial de pagos</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Cuando realicés pagos de suscripciones, multas u otros cargos, aparecerán aquí.
            </p>
          </section>
        ) : (
          <div className="space-y-4">
            {payments?.content.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        )}

        {payments && payments.totalPages > 1 && (
          <div className="flex justify-center pt-2">
            <CustomPagination totalPages={payments.totalPages} paramName="PaymentPage" />
          </div>
        )}
      </section>
    </div>
  );
}

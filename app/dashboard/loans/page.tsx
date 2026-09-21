"use client";

import { PiBooks, PiFunnel } from "react-icons/pi";

import { LoanCard } from "@/components/cards/LoanCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { LoanPageSkeleton } from "@/components/custom/skeletons";
import { Badge } from "@/components/ui/badge";
import { useLoans } from "@/hooks/queries/useLoans";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { LoanOptions } from "@/lib/data";

export default function LoanPage() {
  const { isLoading, loans, status, setStatus } = useLoans();

  const { data: subscription } = useSubscription();

  if (isLoading) {
    return <LoanPageSkeleton />;
  }

  const totalElements = loans?.totalElements ?? 0;

  const maxDaysPerBook = subscription?.active && !subscription.expired ? subscription.maxDaysPerBook : 0;

  const selectedStatusLabel =
    status === "all" ? "Todos" : (LoanOptions.find((option) => option.id === status)?.name ?? "Todos");

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PiBooks className="size-4.5" />
            </div>

            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Biblioteca personal
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Mis préstamos</h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Consultá tus libros prestados, fechas de devolución, renovaciones e historial.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PiFunnel className="size-4" />

            <span>Estado:</span>

            <Badge variant="secondary">{selectedStatusLabel}</Badge>
          </div>

          <CustomSelect
            headline="Todos los estados"
            options={LoanOptions}
            selectedItem={status}
            setSelectedItem={setStatus}
          />
        </div>
      </section>

      <div className="flex items-center justify-between border-y border-border/60 py-3">
        <p className="text-sm text-muted-foreground">
          {totalElements === 0 ? "Sin resultados" : totalElements === 1 ? "1 préstamo" : `${totalElements} préstamos`}
        </p>

        {status !== "all" && <span className="text-xs text-muted-foreground">Filtro: {selectedStatusLabel}</span>}
      </div>

      {totalElements === 0 ? (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <PiBooks className="size-6" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-foreground">No hay préstamos</h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {status === "all"
              ? "Cuando solicités un libro, su préstamo aparecerá aquí."
              : `No tenés préstamos con el estado “${selectedStatusLabel}”.`}
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {loans?.content.map((loan) => (
            <LoanCard key={loan.id} loan={loan} maxDaysPerBook={maxDaysPerBook} />
          ))}
        </section>
      )}

      {loans && loans.totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <CustomPagination totalPages={loans.totalPages} paramName="PageLoans" />
        </div>
      )}
    </div>
  );
}

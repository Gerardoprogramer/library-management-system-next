'use client';

import { LoanOptions } from "@/lib/data";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { useLoans } from "@/hooks/queries/useLoans";
import { LoanCard } from "@/components/cards/LoanCard";
import { LoanPageSkeleton } from "@/components/custom/skeletons";

export default function LoanPage() {
  const { isLoading, loans, status, setStatus } = useLoans();

  if (isLoading) return <LoanPageSkeleton />;

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
        Mis Préstamos
      </h1>
      <div className="flex justify-between">
        <p className="font-body text-lg text-muted-foreground mb-8">
          {loans?.content.filter((l) => l.overdue === false).length} activos · {loans?.content.filter((l) => l.overdue === true).length} vencidos
        </p>
        <CustomSelect headline="Todos los Status" options={LoanOptions} selectedItem={status} setSelectedItem={setStatus} />
      </div>
      <div className="space-y-4">

        {loans?.totalElements === 0 ? (
          <p className="font-body text-muted-foreground text-center py-12">No tienes préstamos activos.</p>
        ) : (
          loans?.content.map((loan) =>
            <LoanCard key={loan.id} loan={loan} />
          )
        )}
      </div>
      {loans && loans?.totalPages > 1 && (
        <div className="px-4 mt-6">
          <CustomPagination totalPages={loans?.totalPages} paramName="PageLoans" />
        </div>
      )}
    </div>
  );
}
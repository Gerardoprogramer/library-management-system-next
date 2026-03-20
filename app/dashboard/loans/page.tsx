'use client';

import { LoanOptions } from "@/lib/data";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { useLoans } from "@/hooks/useLoans";
import { LoanCard } from "@/components/cards/LoanCard";

export default function LoanPage() {
  const { isLoading, loans, status, setStatus } = useLoans();

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
        {loans && loans?.content.map((loan) =>
          <LoanCard key={loan.id} loan={loan} />
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
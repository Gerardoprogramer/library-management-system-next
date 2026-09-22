"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiArrowRight, PiArrowsClockwise, PiCheck, PiInfo, PiWarning } from "react-icons/pi";

import { RenewLoanDialog } from "@/components/dialog/RenewLoanDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRenewLoan } from "@/hooks/mutations/useRenewLoan";
import { useCheckinLoan } from "@/hooks/mutations/useCheckinLoan";
import { useCurrentUrl } from "@/hooks/Utilidades/useCurrentUrl";
import { useQueryParams } from "@/hooks/Utilidades/useQueryParams";
import { statusLoanConfig, typeLoanConfig } from "@/lib/data";
import { formatDate } from "@/lib/date-utils";
import type { meLoans } from "@/lib/definitions";
import { createSlug } from "@/lib/slug-utils";

interface Props {
  loan: meLoans;
  maxDaysPerBook?: number;
}

export const LoanCard = ({ loan, maxDaysPerBook = 0 }: Props) => {
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);

  const queryParams = useQueryParams();
  const currentUrl = useCurrentUrl();

  const { performRenewal, isRenewing } = useRenewLoan(loan.bookId);
  const { performCheckin, isCheckingIn } = useCheckinLoan(loan.bookId);

  const statusConfig = statusLoanConfig[loan.status];
  const typeConfig = typeLoanConfig[loan.type];

  const bookHref = {
    pathname: `/dashboard/book/${createSlug(loan.bookId, loan.bookTitle)}`,
    query: {
      ...queryParams,
      from: currentUrl,
    },
  };

  const canRenew =
    loan.status === "CHECKED_OUT" &&
    !loan.overdue &&
    !loan.returnDate &&
    loan.renewalCount < loan.maxRenewals &&
    maxDaysPerBook > 0;

  const handleRenewal = (extensionDays: number, notes?: string) => {
    performRenewal(
      {
        loanId: loan.id,
        extensionDays,
        notes,
      },
      {
        onSuccess: () => {
          setRenewDialogOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Card className={loan.overdue ? "overflow-hidden border-destructive/25" : "overflow-hidden"}>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <Link
              href={bookHref}
              aria-label={`Ver ${loan.bookTitle}`}
              className="group relative aspect-3/4 w-full shrink-0 overflow-hidden bg-muted sm:w-32 md:w-36"
            >
              <Image
                src={loan.bookCoverImageUrl}
                alt={`Portada de ${loan.bookTitle}`}
                fill
                sizes="(max-width: 640px) 100vw, 144px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <Link href={bookHref} className="inline-block max-w-full">
                    <h3 className="line-clamp-2 text-base font-semibold leading-6 tracking-tight text-foreground transition-colors hover:text-primary sm:text-lg">
                      {loan.bookTitle}
                    </h3>
                  </Link>

                  <p className="mt-1 text-sm text-muted-foreground">{loan.author}</p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Badge variant="outline">{typeConfig.label}</Badge>

                  <Badge variant={statusConfig.variant}>
                    <statusConfig.icon />
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
                <LoanMeta label="Préstamo" value={formatDate(loan.checkoutDate)} />

                <LoanMeta label="Vencimiento" value={formatDate(loan.dueDate)} destructive={loan.overdue} />

                {loan.returnDate ? (
                  <LoanMeta label="Devuelto" value={formatDate(loan.returnDate)} />
                ) : (
                  <LoanMeta
                    label="Tiempo restante"
                    value={
                      loan.overdue
                        ? `${loan.overdueDays} ${loan.overdueDays === 1 ? "día de atraso" : "días de atraso"}`
                        : `${Math.max(0, loan.remainingDays)} ${loan.remainingDays === 1 ? "día" : "días"}`
                    }
                    destructive={loan.overdue}
                  />
                )}

                <LoanMeta label="Renovaciones" value={`${loan.renewalCount} de ${loan.maxRenewals}`} />
              </div>

              {loan.overdue && (
                <Alert variant="destructive" className="mt-5">
                  <PiWarning />

                  <AlertTitle>Préstamo vencido</AlertTitle>

                  <AlertDescription>
                    Este libro tiene {loan.overdueDays === 1 ? "1 día" : `${loan.overdueDays} días`} de atraso.
                    {loan.fineAmount > 0 && " Además, registra una multa pendiente."}
                  </AlertDescription>
                </Alert>
              )}

              {loan.notes && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="mt-4 flex max-w-sm items-center gap-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <PiInfo className="size-4 shrink-0" />

                        <span className="truncate">{loan.notes}</span>
                      </button>
                    </TooltipTrigger>

                    <TooltipContent side="bottom" className="max-w-xs">
                      {loan.notes}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                {canRenew && (
                  <Button type="button" size="sm" onClick={() => setRenewDialogOpen(true)}>
                    <PiArrowsClockwise />
                    Renovar préstamo
                  </Button>
                )}

                {loan.status === "CHECKED_OUT" && !loan.returnDate && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isCheckingIn}
                    onClick={() => performCheckin(loan.id)}
                  >
                    <PiCheck />
                    {isCheckingIn ? "Devolviendo..." : "Devolver libro"}
                  </Button>
                )}

                <Button asChild variant="ghost" size="sm">
                  <Link href={bookHref}>
                    Ver libro
                    <PiArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {renewDialogOpen && (
        <RenewLoanDialog
          open={renewDialogOpen}
          onOpenChange={setRenewDialogOpen}
          bookTitle={loan.bookTitle}
          dueDate={loan.dueDate}
          maxDaysPerBook={maxDaysPerBook}
          isPending={isRenewing}
          onConfirm={handleRenewal}
        />
      )}
    </>
  );
};

interface LoanMetaProps {
  label: string;
  value: string | undefined;
  destructive?: boolean;
}

const LoanMeta = ({ label, value, destructive = false }: LoanMetaProps) => {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>

      <p
        className={
          destructive ? "mt-1 text-sm font-semibold text-destructive" : "mt-1 text-sm font-medium text-foreground"
        }
      >
        {value ?? "—"}
      </p>
    </div>
  );
};

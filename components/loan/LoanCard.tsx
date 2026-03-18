import { meLoans } from "@/lib/definitions"
import { Badge } from "../ui/badge"
import { statusLoanConfig } from "@/lib/data";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, ArrowRight, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useCurrentUrl } from "@/hooks/useCurrentUrl";


interface Props {
    loan: meLoans
}

export const LoanCard = ({ loan }: Props) => {
    const config = statusLoanConfig[loan.status];

    const queryParams = useQueryParams();
    const currentUrl = useCurrentUrl();

    return (
        <Card key={loan.id} className={`overflow-hidden transition-all ${loan.overdue ? "border-destructive/40 bg-destructive/5" : ""}`}>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                    <Link
                        href={{
                            pathname: `/dashboard/book/${loan.bookId}`,
                            query: {
                                ...queryParams,
                                from: currentUrl
                            }
                        }}>
                        <img
                            src={loan.bookCoverImageUrl}
                            alt={loan.bookTitle}
                            className="w-full sm:w-20 h-32 sm:h-auto rounded-t sm:rounded-l sm:rounded-tr-none object-cover cursor-pointer shrink-0"
                        />
                    </Link>

                    <div className="flex-1 p-4 sm:p-5 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="min-w-0">
                                <h3
                                    className="font-display text-base font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                                >
                                    {loan.bookTitle}
                                </h3>
                                <p className="font-body text-sm text-muted-foreground">{loan.author}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Badge variant="outline" className="font-body text-[10px] px-2 py-0.5">
                                    {loan.type}
                                </Badge>
                                <Badge variant={config.variant} className="font-body gap-1">
                                    <config.icon className="w-3 h-3" /> {config.label}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                            <div>
                                <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Préstamo</p>
                                <p className="font-body text-sm text-foreground">{loan.checkoutDate}</p>
                            </div>
                            <div>
                                <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Vencimiento</p>
                                <p className={`font-body text-sm ${loan.overdue ? "text-destructive font-semibold" : "text-foreground"}`}>{loan.dueDate}</p>
                            </div>
                            {loan.returnDate && (
                                <div>
                                    <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Devuelto</p>
                                    <p className="font-body text-sm text-foreground">{loan.returnDate}</p>
                                </div>
                            )}
                            <div>
                                <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Renovaciones</p>
                                <p className="font-body text-sm text-foreground">{loan.renewalCount}/{loan.maxRenewals}</p>
                            </div>
                        </div>

                        {loan.overdue && loan.overdueDays > 0 && (
                            <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-md px-3 py-1.5 mb-3">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span className="font-body text-xs font-medium">{loan.overdueDays} días de retraso</span>
                            </div>
                        )}

                        {loan.notes && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 text-muted-foreground mb-3 cursor-help">
                                            <Info className="w-3.5 h-3.5" />
                                            <span className="font-body text-xs line-clamp-1">{loan.notes}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent><p className="font-body text-xs max-w-60">{loan.notes}</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <div className="flex items-center gap-2">
                            {loan.renewalCount >= loan.maxRenewals && (
                                <Button size="sm" className="font-body text-xs gap-1.5">
                                    <RefreshCw className="w-3 h-3" /> Renovar
                                </Button>
                            )}
                            <Link
                                href={{
                                    pathname: `/dashboard/book/${loan.bookId}`,
                                    query: {
                                        ...queryParams,
                                        from: currentUrl
                                    }
                                }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="font-body text-xs gap-1"

                                >
                                    Ver libro <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

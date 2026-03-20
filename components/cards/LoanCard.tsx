import { meLoans } from "@/lib/definitions"
import { Badge } from "../ui/badge"
import { statusLoanConfig, typeLoanConfig } from "@/lib/data";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, ArrowRight, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useCurrentUrl } from "@/hooks/useCurrentUrl";
import { createSlug } from "@/lib/slug-utils";
import Image from "next/image";
import { formatDate } from "@/lib/date-utils";

interface Props {
    loan: meLoans
}

export const LoanCard = ({ loan }: Props) => {
    const config = statusLoanConfig[loan.status];
    const typeConfig = typeLoanConfig[loan.type];

    const queryParams = useQueryParams();
    const currentUrl = useCurrentUrl();



    return (
        <Card className={`overflow-hidden transition-all duration-300 border-white/5 hover:border-white/10 ${loan.overdue ? "border-destructive/40 bg-destructive/5" : "bg-card"}`}>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                    <Link
                        href={{
                            pathname: `/dashboard/book/${createSlug(loan.bookId, loan.bookTitle)}`,
                            query: { ...queryParams, from: currentUrl }
                        }}
                        className="relative w-full sm:w-32 md:w-40 aspect-2/3 sm:aspect-auto shrink-0 overflow-hidden shadow-xl"
                    >
                        <Image
                            src={loan.bookCoverImageUrl}
                            alt={loan.bookTitle}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-110"
                            sizes="(max-width: 640px) 100vw, 160px"
                            priority={false}
                        />
                    </Link>

                    <div className="flex-1 p-5 sm:p-6 min-w-0 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="min-w-0">
                                    <h3 className="font-display text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1 cursor-pointer">
                                        {loan.bookTitle}
                                    </h3>
                                    <p className="font-body text-sm text-muted-foreground/80 italic">{loan.author}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Badge variant="outline" className="font-body text-[10px] border-white/10 ">
                                        {typeConfig.label}
                                    </Badge>
                                    <Badge variant={config.variant} className="font-body gap-1 shadow-sm">
                                        <config.icon className="w-3 h-3" /> {config.label}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Préstamo</p>
                                    <p className="text-sm font-medium">{formatDate(loan.checkoutDate)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Vencimiento</p>
                                    <p className={`text-sm font-bold ${loan.overdue ? "text-destructive" : "text-foreground"}`}>
                                        {formatDate(loan.dueDate)}
                                    </p>
                                </div>
                                {loan.returnDate && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Devuelto</p>
                                        <p className="text-sm">{formatDate(loan.returnDate)}</p>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Renovaciones</p>
                                    <p className="text-sm font-medium">{loan.renewalCount} / {loan.maxRenewals}</p>
                                </div>
                            </div>

                            {loan.overdue && (
                                <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2 mb-4">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <span className="font-body text-xs font-semibold">{loan.overdueDays} días de retraso</span>
                                </div>
                            )}

                            {loan.notes && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1.5 text-muted-foreground/70 mb-4 cursor-help group w-fit">
                                                <Info className="w-3.5 h-3.5 group-hover:text-foreground transition-colors" />
                                                <span className="text-xs line-clamp-1 max-w-200px">{loan.notes}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="max-w-xs">
                                            <p className="text-xs">{loan.notes}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                {loan.renewalCount < loan.maxRenewals && !loan.returnDate && (
                                    <Button size="sm" className="font-body text-xs h-8 gap-1.5 px-4 shadow-lg shadow-primary/10">
                                        <RefreshCw className="w-3 h-3" /> Renovar
                                    </Button>
                                )}
                                <Link
                                    href={{
                                        pathname: `/dashboard/book/${createSlug(loan.bookId, loan.bookTitle)}`,
                                        query: { ...queryParams, from: currentUrl }
                                    }}
                                >
                                    <Button variant="ghost" size="sm" className="font-body text-xs h-8 gap-1 hover:bg-white/5 text-muted-foreground hover:text-foreground">
                                        Ver libro <ArrowRight className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

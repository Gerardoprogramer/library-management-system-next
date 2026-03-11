import { meLoans } from "@/lib/definitions"
import { Badge } from "../ui/badge"
import { statusLoanConfig } from "@/lib/data";
import { CheckCircle, Clock, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
    loan: meLoans
}

export const LoanCard = ({ loan }: Props) => {
    const config = statusLoanConfig[loan.status];

    return (
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
            <img
                src={loan.bookCoverImageUrl}
                alt={loan.bookTitle}
                className="w-16 h-24 rounded object-cover cursor-pointer shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <h3 className="font-display text-base font-semibold text-foreground line-clamp-1">{loan.bookTitle}</h3>
                        <p className="font-body text-sm text-muted-foreground">{loan.author}</p>
                    </div>
                    <Badge variant={config.variant} className="font-body shrink-0 gap-1">
                        <config.icon className="w-3 h-3" /> {config.label}
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-body text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Prestado: {loan.checkoutDate}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Vence: {loan.dueDate}</span>
                    {loan.returnDate && <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Devuelto: {loan.returnDate}</span>}
                    {loan.fineAmount > 0 && <span className="flex items-center gap-1 text-destructive"><DollarSign className="w-3.5 h-3.5" /> Multa: ${loan.fineAmount.toFixed(2)}</span>}
                </div>
                <div className="flex items-center gap-3 mt-3">
                    <span className="font-body text-xs text-muted-foreground">Renovaciones: {loan.renewalCount}/{loan.maxRenewals}</span>
                    {config === statusLoanConfig.CHECKED_OUT && loan.renewalCount < loan.maxRenewals && (
                        <Button variant="outline" size="sm" className="font-body text-xs gap-1"><RefreshCw className="w-3 h-3" /> Renovar</Button>
                    )}
                </div>
            </div>
        </div>
    )
}

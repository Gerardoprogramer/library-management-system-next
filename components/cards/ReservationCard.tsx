import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { reservationBook } from "@/lib/definitions";
import { ArrowRight, XCircle, BookOpen, Bell, Info } from "lucide-react";
import { statusConfig } from "@/lib/data";
import { formatDate } from "@/lib/date-utils";
import Image from "next/image";
import Link from "next/link";
import { useQueryParams } from "@/hooks/Utilidades/useQueryParams";
import { useCurrentUrl } from "@/hooks/Utilidades/useCurrentUrl";
import { createSlug } from "@/lib/slug-utils";

interface Props {
    data: reservationBook
}

export const ReservationCard = ({ data }: Props) => {
    const config = statusConfig[data.status];
    const canCancel = data.status === "PENDING" || data.status === "AVAILABLE";
    const queryParams = useQueryParams();
    const currentUrl = useCurrentUrl();

    return (
        <Card className={`overflow-hidden transition-all ${data.status === "AVAILABLE" ? "border-primary/50 ring-1 ring-primary/20" : ""}`}>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                    <Link
                        href={{
                            pathname: `/dashboard/book/${createSlug(data.bookId, data.bookTitle)}`,
                            query: { ...queryParams, from: currentUrl }
                        }}
                        className="relative w-full sm:w-32 md:w-40 aspect-2/3 sm:aspect-auto shrink-0 overflow-hidden shadow-xl"
                    >
                        <Image
                            src={data.bookCoverImageUrl}
                            alt={data.bookTitle}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-110"
                            sizes="(max-width: 640px) 100vw, 160px"
                            priority={false}
                        />
                    </Link>
                    <div className="flex-1 p-4 sm:p-5 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="min-w-0">
                                <Link
                                    href={{
                                        pathname: `/dashboard/book/${createSlug(data.bookId, data.bookTitle)}`,
                                        query: { ...queryParams, from: currentUrl }
                                    }}>
                                    <h3
                                        className="font-display text-base font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                                    >
                                        {data.bookTitle}
                                    </h3>
                                </Link>
                                <p className="font-body text-sm text-muted-foreground">{data.author}</p>
                            </div>
                            <Badge variant={config.variant} className="font-body gap-1 shrink-0">
                                <config.icon className="w-3 h-3" /> {config.label}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                            <div>
                                <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Reservado</p>
                                <p className="font-body text-sm text-foreground">{formatDate(data.reservedAt)}</p>
                            </div>
                            {data.queuePosition != null && data.status === "PENDING" && (
                                <div>
                                    <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Posición</p>
                                    <p className="font-body text-sm text-foreground font-semibold">#{data.queuePosition} en cola</p>
                                </div>
                            )}
                            {data.availableAt && (
                                <div>
                                    <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Disponible desde</p>
                                    <p className="font-body text-sm text-foreground">{formatDate(data.availableAt)}</p>
                                </div>
                            )}
                            {data.availableUntil && data.status === "AVAILABLE" && (
                                <div>
                                    <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Recoger antes de</p>
                                    <p className="font-body text-sm text-primary font-semibold">{formatDate(data.availableUntil)}</p>
                                </div>
                            )}
                            {data.fulfilledAt && (
                                <div>
                                    <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Recogido</p>
                                    <p className="font-body text-sm text-foreground">{formatDate(data.fulfilledAt)}</p>
                                </div>
                            )}
                            {data.cancelledAt && (
                                <div>
                                    <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Cancelada</p>
                                    <p className="font-body text-sm text-foreground">{formatDate(data.cancelledAt)}</p>
                                </div>
                            )}
                        </div>

                        {data.status === "AVAILABLE" && data.notificationSent && (
                            <div className="flex items-center gap-2 text-primary bg-primary/10 rounded-md px-3 py-1.5 mb-3">
                                <Bell className="w-3.5 h-3.5 shrink-0" />
                                <span className="font-body text-xs font-medium">Notificación enviada — recoge tu libro antes del {formatDate(data.availableUntil)}</span>
                            </div>
                        )}

                        {data.notes && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 text-muted-foreground mb-3 cursor-help">
                                            <Info className="w-3.5 h-3.5" />
                                            <span className="font-body text-xs line-clamp-1">{data.notes}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent><p className="font-body text-xs max-w-60">{data.notes}</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <div className="flex items-center gap-2">
                            {data.status === "AVAILABLE" && (
                                <Button size="sm" className="font-body text-xs gap-1.5">
                                    <BookOpen className="w-3 h-3" /> Recoger libro
                                </Button>
                            )}
                            {canCancel && (
                                <Button variant="outline" size="sm" className="font-body text-xs gap-1.5">
                                    <XCircle className="w-3 h-3" /> Cancelar
                                </Button>
                            )}
                            <Link
                                href={{
                                    pathname: `/dashboard/book/${createSlug(data.bookId, data.bookTitle)}`,
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
            </CardContent>
        </Card>
    )
}

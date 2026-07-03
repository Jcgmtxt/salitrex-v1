import { Link } from "@tanstack/react-router";
import { User, Clock, Calendar, FileText, CheckCircle2 } from "lucide-react";
import type { Income } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

interface Props {
    income: Income;
    formatDate: (dateStr?: string | null) => string;
}

export function IncomeCarInfo({ income, formatDate }: Props) {
    const isEnTaller = !income.exit_date_time;

    return (
        <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.04] pb-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-widest font-bold">
                            {income.car?.license_plate}
                        </Badge>
                        {isEnTaller ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-medium">
                                En taller
                            </Badge>
                        ) : (
                            <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 font-medium">
                                Entregado
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-xl text-white font-bold leading-tight">
                        {income.car?.brand} {income.car?.model}
                    </CardTitle>
                </div>
            </CardHeader>
            
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Propietario
                    </p>
                    <p className="text-zinc-200 font-medium text-sm">{income.car?.client_name || "Desconocido"}</p>
                    <Link
                        to={`/clients/${income.car?.client_id}` as any}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-block mt-0.5"
                    >
                        Ver ficha del cliente
                    </Link>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider flex items-center gap-1">
                        Vehículo
                    </p>
                    <p className="text-zinc-200 font-medium text-sm">
                        Año {income.car?.year} • Color <span className="capitalize">{income.car?.color}</span>
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">Tamaño: {income.car?.size}</p>
                </div>

                <div className="space-y-1 border-t border-white/[0.04] pt-4 sm:border-t-0 sm:pt-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Fecha de Ingreso
                    </p>
                    <p className="text-zinc-200 font-medium text-sm">{formatDate(income.income_date_time)}</p>
                </div>

                <div className="space-y-1 border-t border-white/[0.04] pt-4 sm:border-t-0 sm:pt-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Salida Acordada
                    </p>
                    <p className="text-zinc-200 font-medium text-sm">{formatDate(income.agreed_exit_date_time)}</p>
                </div>

                {income.exit_date_time && (
                    <div className="space-y-1 sm:col-span-2 border-t border-white/[0.04] pt-4 flex flex-col gap-0.5">
                        <p className="text-[10px] text-emerald-500 uppercase font-semibold tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fecha de Entrega Real
                        </p>
                        <p className="text-emerald-400 font-medium text-sm">{formatDate(income.exit_date_time)}</p>
                    </div>
                )}

                <div className="space-y-1.5 sm:col-span-2 border-t border-white/[0.04] pt-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Observaciones de Entrada
                    </p>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 text-sm text-zinc-300 min-h-[60px] whitespace-pre-wrap">
                        {income.notes || <span className="text-zinc-600 italic">Sin observaciones iniciales</span>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

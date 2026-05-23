import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { User, Calendar, Camera, Clock } from "lucide-react";
import type { Income } from "../types";

interface Props {
    incomes: Income[];
}

export function IncomesMobileList({ incomes }: Props) {
    const navigate = useNavigate();

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "Sin acordar";
        return new Date(dateStr).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="grid gap-3 md:hidden">
            {incomes.map((income) => {
                const isEnTaller = !income.exit_date_time;
                const photoCount = income.photos?.length || 0;

                return (
                    <Card
                        key={income.id}
                        className="border-white/[0.08] bg-white/[0.02] shadow-none backdrop-blur-sm cursor-pointer active:bg-white/[0.05] transition-colors"
                        onClick={() => navigate({ to: `/income/${income.id}` as any })}
                    >
                        <CardContent className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-zinc-200 text-base leading-none mb-1.5 uppercase tracking-wider">
                                        {income.car?.license_plate}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        {income.car?.brand} {income.car?.model}
                                    </p>
                                </div>
                                {isEnTaller ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold">
                                        En taller
                                    </Badge>
                                ) : (
                                    <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 text-[10px] font-semibold">
                                        Entregado
                                    </Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 text-xs border-t border-white/[0.04] pt-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Entrada
                                    </span>
                                    <span className="text-zinc-300 font-medium">{formatDate(income.income_date_time)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Salida
                                    </span>
                                    <span className="text-zinc-300 font-medium">{formatDate(income.agreed_exit_date_time)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-white/[0.04] pt-2 mt-1 text-xs text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-zinc-500" />
                                    <span className="truncate max-w-[150px]">{income.car?.client_name || "Desconocido"}</span>
                                </div>

                                {photoCount > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.04]">
                                        <Camera className="h-3 w-3" /> {photoCount} foto{photoCount > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

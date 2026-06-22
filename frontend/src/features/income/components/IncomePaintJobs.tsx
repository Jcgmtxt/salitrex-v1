import { PaintBucket } from "lucide-react";
import type { PaintJob } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
    paintJobs?: PaintJob[];
    formatCurrency: (val: number) => string;
}

export function IncomePaintJobs({ paintJobs, formatCurrency }: Props) {
    return (
        <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2 font-bold">
                    <PaintBucket className="w-4.5 h-4.5 text-indigo-400" />
                    Trabajos de Pintura Asociados
                </CardTitle>
            </CardHeader>
            <CardContent>
                {paintJobs && paintJobs.length > 0 ? (
                    <div className="space-y-3">
                        {paintJobs.map((job) => (
                            <div
                                key={job.id}
                                className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.01] flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-indigo-500/20 transition-all"
                            >
                                <div>
                                    <h4 className="font-semibold text-zinc-200 capitalize text-sm">{job.paint_type}</h4>
                                    <p className="text-[10px] text-zinc-500">
                                        Registrado el {new Date(job.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-left sm:text-right">
                                        <p className="text-zinc-400 text-xs">Precio Negociado</p>
                                        <p className="text-indigo-400 font-bold text-base">{formatCurrency(job.negotiated_price)}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-zinc-500 text-[10px] uppercase font-semibold">Margen</p>
                                        <Badge className={cn(
                                            "text-[10px] font-bold border py-0.5 px-1.5",
                                            job.margin_percent >= 30 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {job.margin_percent.toFixed(1)}%
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-zinc-500 border border-dashed border-white/[0.08] rounded-xl bg-white/[0.01]">
                        <PaintBucket className="w-8 h-8 mx-auto mb-2 opacity-20 text-indigo-400" />
                        <p className="text-sm">No hay trabajos de pintura asignados para este ingreso.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

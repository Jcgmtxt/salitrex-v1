import { useIncome } from "../hooks/use-incomes";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Edit2, Calendar, User, Clock, FileText, PaintBucket, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PhotoGallery } from "./PhotoGallery";
import { EditIncomeDialog } from "./EditIncomeDialog";
import { cn } from "@/lib/utils";

export function IncomeDetail({ incomeId }: { incomeId: number }) {
    const { data: income, isLoading, error } = useIncome(incomeId);

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "Pendiente";
        return new Date(dateStr).toLocaleString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(val);
    };

    if (isLoading) {
        return <IncomeDetailSkeleton />;
    }

    if (error || !income) {
        return (
            <div className="p-8 text-center text-red-400 max-w-xl mx-auto">
                <p>Error al cargar el detalle del ingreso. {error?.message}</p>
                <Link to="/income" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 font-semibold">
                    Volver a Entradas
                </Link>
            </div>
        );
    }

    const isEnTaller = !income.exit_date_time;

    return (
        <div className="space-y-6 w-full max-w-6xl mx-auto pb-12">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Link to="/income" className="hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Entradas
                    </Link>
                    <span>/</span>
                    <span className="text-zinc-200">Detalle de Ingreso</span>
                </div>
                
                <EditIncomeDialog income={income}>
                    <Button variant="outline" className="border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 h-9">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar Registro
                    </Button>
                </EditIncomeDialog>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1 & 2: Info Card and Paint Jobs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Entry Details */}
                    <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.04] pb-4">
                            <div>
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-widest font-bold">
                                        {income.car?.license_plate}
                                    </Badge>
                                    {isEnTaller ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                            En taller
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
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
                                <div className="space-y-1 sm:col-span-2 border-t border-white/[0.04] pt-4">
                                    <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider flex items-center gap-1">
                                        <CheckCircle2Icon /> Fecha de Entrega Real
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

                    {/* Paint Jobs Section */}
                    <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-lg text-white flex items-center gap-2 font-bold">
                                <PaintBucket className="w-5 h-5 text-indigo-400" />
                                Trabajos de Pintura Asociados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {income.paint_jobs && income.paint_jobs.length > 0 ? (
                                <div className="space-y-3">
                                    {income.paint_jobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.01] flex flex-col sm:flex-row justify-between sm:items-center gap-3"
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
                </div>

                {/* Column 3: Category Tabbed Photo Gallery */}
                <div className="space-y-6">
                    <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md h-full min-h-[400px]">
                        <CardHeader className="pb-3 border-b border-white/[0.04]">
                            <CardTitle className="text-base text-white flex items-center gap-2 font-bold">
                                <Camera className="w-4 h-4 text-indigo-400" />
                                Registro Fotográfico
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="mt-4">
                            <PhotoGallery photos={income.photos} />
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

function CheckCircle2Icon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5 text-emerald-400"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function IncomeDetailSkeleton() {
    return (
        <div className="space-y-6 w-full max-w-6xl mx-auto pb-12">
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40 bg-white/[0.05]" />
                <Skeleton className="h-9 w-32 bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-[280px] w-full rounded-xl bg-white/[0.05]" />
                    <Skeleton className="h-[180px] w-full rounded-xl bg-white/[0.05]" />
                </div>
                <div>
                    <Skeleton className="h-[480px] w-full rounded-xl bg-white/[0.05]" />
                </div>
            </div>
        </div>
    );
}

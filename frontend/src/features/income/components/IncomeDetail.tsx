import { useIncome } from "../hooks/use-incomes";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Edit2, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PhotoGallery } from "./PhotoGallery";
import { EditIncomeDialog } from "./EditIncomeDialog";
import { IncomeDeliveredAlert } from "./IncomeDeliveredAlert";
import { IncomeCarInfo } from "./IncomeCarInfo";
import { IncomePaintJobs } from "./IncomePaintJobs";
import { IncomeNotesLog } from "./IncomeNotesLog";

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
        <div className="space-y-6 w-full max-w-6xl mx-auto pb-12 pt-4">
            <div className="flex justify-end">
                {isEnTaller ? (
                    <EditIncomeDialog income={income}>
                        <Button variant="outline" className="border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 h-9">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Editar Registro
                        </Button>
                    </EditIncomeDialog>
                ) : (
                    <Button 
                        variant="outline" 
                        className="border-white/[0.08] text-zinc-500 cursor-not-allowed h-9 opacity-50"
                        disabled
                    >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar Registro (Bloqueado)
                    </Button>
                )}
            </div>

            {/* Delivered Warning Banner */}
            <IncomeDeliveredAlert isEnTaller={isEnTaller} />

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1 & 2: Info Card, Timeline/Bitacora, and Paint Jobs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Entry Details */}
                    <IncomeCarInfo income={income} formatDate={formatDate} />

                    {/* Timeline / Bitacora Card */}
                    <IncomeNotesLog incomeId={income.id} notesLog={income.notes_log} formatDate={formatDate} />

                    {/* Paint Jobs Section */}
                    <IncomePaintJobs 
                        paintJobs={income.paint_jobs} 
                        formatCurrency={formatCurrency} 
                        carId={income.car_id}
                        incomeId={income.id}
                        isEnTaller={isEnTaller}
                    />
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
                            <PhotoGallery photos={income.photos} incomeId={income.id} />
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
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

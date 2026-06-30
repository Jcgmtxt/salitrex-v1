import { useCar } from "../hooks/use-cars";
import { useIncomes } from "@/features/income/hooks/use-incomes";
import { Link } from "@tanstack/react-router";
import { 
    Car as CarIcon, 
    User, 
    Calendar, 
    Palette, 
    Ruler, 
    ArrowLeft, 
    Clock, 
    FileText, 
    CheckCircle2, 
    ChevronRight, 
    PaintBucket, 
    Eye 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface Props {
    carId: number;
}

export function CarDetail({ carId }: Props) {
    const { data: car, isLoading: isLoadingCar, error: carError } = useCar(carId);

    // Fetch incomes matching the car license plate to filter them
    const { data: incomesData, isLoading: isLoadingIncomes } = useIncomes({
        query: car?.license_plate || undefined,
        limit: 100, // Fetch all recent ones
    });

    if (isLoadingCar) {
        return (
            <div className="space-y-6 w-full max-w-5xl mx-auto pb-12 pt-4 px-4">
                <Skeleton className="h-10 w-48 bg-white/[0.05]" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-48 md:col-span-1 bg-white/[0.05]" />
                    <Skeleton className="h-96 md:col-span-2 bg-white/[0.05]" />
                </div>
            </div>
        );
    }

    if (carError || !car) {
        return (
            <div className="p-8 text-center text-red-400 max-w-xl mx-auto mt-12 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="font-semibold">Error al cargar el vehículo.</p>
                <p className="text-xs opacity-80 mt-1">{carError?.message || "Vehículo no encontrado"}</p>
                <Link to="/cars" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 font-medium text-sm">
                    Volver a vehículos
                </Link>
            </div>
        );
    }

    // Filter incomes exactly belonging to this car
    const carIncomes = (incomesData?.items ?? []).filter(inc => inc.car_id === carId);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getVehicleSizeLabel = (size: string) => {
        const sizes: Record<string, string> = {
            small: "Pequeño",
            medium: "Mediano",
            large: "Grande",
            extra_large: "Extra Grande"
        };
        return sizes[size] || size;
    };

    return (
        <div className="space-y-6 w-full max-w-6xl mx-auto pb-12 px-4 pt-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link 
                    to="/cars" 
                    className="h-9 w-9 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    title="Volver a vehículos"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CarIcon className="w-6 h-6 text-indigo-400" />
                        Historial del Vehículo
                    </h1>
                    <p className="text-xs text-zinc-400">
                        Consulta los detalles de registro y las entradas de este auto al taller.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Car Specifications Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                            <CarIcon className="h-28 w-28 text-white" />
                        </div>
                        <CardHeader className="pb-3 border-b border-white/[0.04]">
                            <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                                Especificaciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-4">
                            <div>
                                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-widest font-bold text-base px-3 py-1 mb-2">
                                    {car.license_plate}
                                </Badge>
                                <h3 className="font-bold text-xl text-zinc-100">
                                    {car.brand} {car.model}
                                </h3>
                                <p className="text-xs text-zinc-400 mt-0.5">Año Modelo: {car.year}</p>
                            </div>

                            <div className="border-t border-white/[0.04] pt-4 space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 flex items-center gap-1.5"><Palette className="w-4 h-4 text-indigo-400/80" /> Color</span>
                                    <span className="text-zinc-200 capitalize font-medium">{car.color}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 flex items-center gap-1.5"><Ruler className="w-4 h-4 text-indigo-400/80" /> Tamaño</span>
                                    <span className="text-zinc-200 font-medium">{getVehicleSizeLabel(car.size)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400/80" /> Registrado</span>
                                    <span className="text-zinc-300 font-medium">{new Date(car.created_at).toLocaleDateString("es-CO")}</span>
                                </div>
                            </div>

                            {/* Client Owner Section */}
                            <div className="border-t border-white/[0.04] pt-4 mt-2">
                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-3">
                                    Propietario / Cliente
                                </span>
                                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between group">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white leading-tight">
                                                {car.client_name || "Cliente Registrado"}
                                            </p>
                                            <p className="text-[10px] text-zinc-500">ID Cliente: {car.client_id}</p>
                                        </div>
                                    </div>
                                    <Link 
                                        to={`/clients/${car.client_id}`}
                                        className="h-7 w-7 rounded-md bg-white/[0.02] group-hover:bg-indigo-600 border border-white/[0.04] group-hover:border-indigo-500 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all focus:outline-none"
                                        title="Ver perfil del cliente"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Incomes / Check-ins History */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
                        <CardHeader className="pb-3 border-b border-white/[0.04]">
                            <CardTitle className="text-lg text-white flex items-center gap-2 font-bold">
                                <Clock className="w-5 h-5 text-indigo-400" />
                                Historial de Entradas ({carIncomes.length})
                            </CardTitle>
                            <CardDescription className="text-xs text-zinc-400">
                                Listado de servicios y trabajos realizados ordenados por fecha.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isLoadingIncomes ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-24 w-full bg-white/[0.03]" />
                                    <Skeleton className="h-24 w-full bg-white/[0.03]" />
                                </div>
                            ) : carIncomes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-12 w-12 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-zinc-500 mb-3">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-zinc-300">Sin entradas registradas</h4>
                                    <p className="text-xs text-zinc-500 max-w-sm mt-1">
                                        Este vehículo no ha sido ingresado al taller mediante una orden de servicio todavía.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative border-l border-white/[0.08] ml-2 pl-6 space-y-8 py-2">
                                    {carIncomes.map((income) => {
                                        const inWorkshop = !income.exit_date_time;
                                        return (
                                            <div key={income.id} className="relative">
                                                {/* Timeline dot */}
                                                <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-[#0c0c14] ${inWorkshop ? "border-emerald-500 ring-4 ring-emerald-500/20" : "border-zinc-500"}`} />
                                                
                                                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-4 hover:border-white/[0.12] transition-colors relative group">
                                                    
                                                    {/* Top Row: Date and Status Badge */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.04] pb-3">
                                                        <div>
                                                            <p className="text-xs font-semibold text-indigo-400">
                                                                Ingreso: {formatDate(income.income_date_time)}
                                                            </p>
                                                            {income.exit_date_time && (
                                                                <p className="text-[10px] text-zinc-500 mt-0.5">
                                                                    Salida: {formatDate(income.exit_date_time)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {inWorkshop ? (
                                                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                                                                    En Taller
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-xs font-semibold">
                                                                    Entregado
                                                                </Badge>
                                                            )}
                                                            <Link to={`/income/${income.id}`}>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="ghost" 
                                                                    className="h-8 bg-white/[0.02] hover:bg-indigo-600 hover:text-white border border-white/[0.04] hover:border-indigo-500 text-zinc-300 text-xs gap-1"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                    Ver Detalle
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* Middle Section: Notes and Bitacora summary */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        
                                                        {/* Observations */}
                                                        <div className="space-y-1.5">
                                                            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                                                <FileText className="w-3.5 h-3.5 text-indigo-400/80" /> Observaciones Iniciales
                                                            </span>
                                                            <p className="text-zinc-300 text-xs bg-white/[0.01] border border-white/[0.04] p-2.5 rounded-lg italic">
                                                                {income.notes || "Sin observaciones al registrar el ingreso."}
                                                            </p>
                                                        </div>

                                                        {/* Bitácora Note Log count/summary */}
                                                        <div className="space-y-1.5">
                                                            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400/80" /> Actividad en Bitácora ({income.notes_log?.length || 0})
                                                            </span>
                                                            {income.notes_log && income.notes_log.length > 0 ? (
                                                                <div className="space-y-1 bg-white/[0.01] border border-white/[0.04] p-2 rounded-lg max-h-[80px] overflow-y-auto">
                                                                    {income.notes_log.slice(0, 2).map((log, index) => (
                                                                        <p key={index} className="text-[11px] text-zinc-400 truncate">
                                                                            • {log.note} <span className="text-[9px] text-zinc-600">({log.creator_name})</span>
                                                                        </p>
                                                                    ))}
                                                                    {income.notes_log.length > 2 && (
                                                                        <p className="text-[10px] text-indigo-400 mt-1 pl-1">
                                                                            + {income.notes_log.length - 2} notas más...
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-zinc-500 pl-1 italic">Sin notas registradas en bitácora.</p>
                                                            )}
                                                        </div>

                                                    </div>

                                                    {/* Bottom Row: Paint jobs done */}
                                                    {income.paint_jobs && income.paint_jobs.length > 0 && (
                                                        <div className="border-t border-white/[0.04] pt-3">
                                                            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                                                                Trabajos de Pintura Realizados
                                                            </span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {income.paint_jobs.map((job) => (
                                                                    <div key={job.id} className="flex items-center gap-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-2.5 py-1 text-xs text-indigo-300">
                                                                        <PaintBucket className="w-3 h-3" />
                                                                        <span>{job.paint_type}</span>
                                                                        <span className="text-[10px] opacity-60">({new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(job.negotiated_price)})</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

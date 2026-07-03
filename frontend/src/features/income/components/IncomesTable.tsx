import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { X, Camera, User, Clock, FileText, ExternalLink } from "lucide-react";
import type { Income } from "../types";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
    incomes: Income[];
}

export function IncomesTable({ incomes }: Props) {
    const navigate = useNavigate();
    const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "Sin acordar";
        return new Date(dateStr).toLocaleString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="hidden md:flex gap-4 items-start relative transition-all duration-300">
            {/* Tabla Principal */}
            <div className={cn(
                "rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden backdrop-blur-sm transition-all duration-300",
                selectedIncome ? "w-2/3" : "w-full"
            )}>
                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/[0.08] hover:bg-transparent">
                            <TableHead className="text-zinc-400 font-medium">Vehículo</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Cliente</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Entrada</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Salida Acordada</TableHead>
                            <TableHead className="text-zinc-400 font-medium text-center">Fotos</TableHead>
                            <TableHead className="text-zinc-400 font-medium text-right">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {incomes.map((income) => {
                            const isEnTaller = !income.exit_date_time;
                            const photoCount = income.photos?.length || 0;

                            return (
                                <TableRow
                                    key={income.id}
                                    className={cn(
                                        "border-white/[0.08] cursor-pointer transition-colors",
                                        selectedIncome?.id === income.id
                                            ? "bg-indigo-500/10 hover:bg-indigo-500/15"
                                            : "hover:bg-white/[0.04]"
                                    )}
                                    onClick={() => setSelectedIncome(income)}
                                    onDoubleClick={() => navigate({ to: `/income/${income.id}` as any })}
                                >
                                    <TableCell className="font-medium text-zinc-200">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-wider font-semibold">
                                                    {income.car?.license_plate}
                                                </Badge>
                                                <span className="text-sm font-semibold text-zinc-300">
                                                    {income.car?.brand} {income.car?.model}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4 text-zinc-500" />
                                            <span>{income.car?.client_name || "Desconocido"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-300 text-sm">
                                        {formatDate(income.income_date_time)}
                                    </TableCell>
                                    <TableCell className="text-zinc-300 text-sm">
                                        {formatDate(income.agreed_exit_date_time)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {photoCount > 0 ? (
                                            <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/20 gap-1">
                                                <Camera className="h-3.5 w-3.5" />
                                                {photoCount}
                                            </Badge>
                                        ) : (
                                            <span className="text-zinc-600 text-xs">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isEnTaller ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-medium">
                                                En taller
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 font-medium">
                                                Entregado
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Panel Lateral Integrado */}
            {selectedIncome && (
                <div className="w-1/3 shrink-0 rounded-xl border border-white/[0.08] bg-[#0a0a0f] overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-6">
                    <div className="p-4 border-b border-white/[0.08] flex flex-col gap-3 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-widest font-semibold">
                                        {selectedIncome.car?.license_plate}
                                    </Badge>
                                    {!selectedIncome.exit_date_time ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] py-0.5 px-1.5">
                                            En taller
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 text-[10px] py-0.5 px-1.5">
                                            Entregado
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-semibold text-white text-lg leading-tight">
                                    {selectedIncome.car?.brand} {selectedIncome.car?.model}
                                </h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                                onClick={() => setSelectedIncome(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200"
                                onClick={() => navigate({ to: `/income/${selectedIncome.id}` as any })}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver Detalle
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Tiempos */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                <Clock className="h-4 w-4 text-indigo-400" />
                                Tiempos del servicio
                            </h4>
                            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 space-y-2.5 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Fecha de Entrada</span>
                                    <span className="text-zinc-200 font-medium">{formatDate(selectedIncome.income_date_time)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Salida Acordada</span>
                                    <span className="text-zinc-200 font-medium">{formatDate(selectedIncome.agreed_exit_date_time)}</span>
                                </div>
                                {selectedIncome.exit_date_time && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-500">Fecha de Entrega</span>
                                        <span className="text-zinc-200 font-medium">{formatDate(selectedIncome.exit_date_time)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dueño y Vehículo */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                <User className="h-4 w-4 text-indigo-400" />
                                Información de Contacto
                            </h4>
                            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 text-sm">
                                <p className="text-zinc-200 font-semibold mb-1">{selectedIncome.car?.client_name || "Desconocido"}</p>
                                <p className="text-zinc-500 text-xs">Dueño del vehículo</p>
                                <button
                                    className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 font-medium flex items-center gap-1"
                                    onClick={() => navigate({ to: `/clients/${selectedIncome.car?.client_id}` as any })}
                                >
                                    Ir al perfil del cliente <ExternalLink className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        {/* Notas */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="h-4 w-4 text-indigo-400" />
                                Notas de Ingreso
                            </h4>
                            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 text-sm text-zinc-300 min-h-[60px] whitespace-pre-wrap">
                                {selectedIncome.notes || <span className="text-zinc-600 italic">Sin observaciones registradas</span>}
                            </div>
                        </div>

                        {/* Galería (Previsualización) */}
                        {selectedIncome.photos && selectedIncome.photos.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                    <Camera className="h-4 w-4 text-indigo-400" />
                                    Fotos ({selectedIncome.photos.length})
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedIncome.photos.slice(0, 4).map((photo) => (
                                        <div key={photo.id} className="relative aspect-video rounded-md border border-white/[0.08] overflow-hidden bg-zinc-950">
                                            {photo.thumbnail_url || photo.presigned_url ? (
                                                <img
                                                    src={photo.thumbnail_url || photo.presigned_url}
                                                    alt={photo.category}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 capitalize">
                                                    {photo.category}
                                                </div>
                                            )}
                                            <div className="absolute bottom-1 left-1 bg-black/70 px-1 rounded text-[8px] text-zinc-300 capitalize">
                                                {photo.category}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

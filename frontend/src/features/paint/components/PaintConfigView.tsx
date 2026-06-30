import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
    PaintBucket, 
    Sliders, 
    ArrowLeft, 
    Loader2, 
    Ruler, 
    Save, 
    DollarSign, 
    Percent 
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/shared/components/ui/table";
import { 
    useActivePaintConfig, 
    useUpdatePaintConfig, 
    useVehicleAreas, 
    useUpdateVehicleArea 
} from "../hooks/use-paint";
import type { VehicleSize } from "../types";

const paintConfigSchema = z.object({
    price_per_cm2: z.coerce.number().min(0.01, "El precio debe ser mayor a 0"),
    min_margin_percent: z.coerce.number().min(0, "El margen mínimo no puede ser negativo"),
    target_margin_percent: z.coerce.number().min(0, "El margen objetivo no puede ser negativo"),
}).refine((data) => data.target_margin_percent >= data.min_margin_percent, {
    message: "El margen objetivo debe ser mayor o igual al margen mínimo",
    path: ["target_margin_percent"],
});

type PaintConfigInput = z.infer<typeof paintConfigSchema>;

const sizeLabels: Record<VehicleSize, string> = {
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
    extra_large: "Extra Grande"
};

const defaultAreas: Record<VehicleSize, number> = {
    small: 10000,
    medium: 15000,
    large: 20000,
    extra_large: 25000
};

export function PaintConfigView() {
    // 1. Fetch current active configuration
    const { data: config, isLoading: isLoadingConfig } = useActivePaintConfig();
    const updateConfigMutation = useUpdatePaintConfig();

    // 2. Fetch vehicle size areas
    const { data: areas, isLoading: isLoadingAreas } = useVehicleAreas();
    const updateAreaMutation = useUpdateVehicleArea();

    // Form for base configuration
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PaintConfigInput>({
        resolver: zodResolver(paintConfigSchema),
        defaultValues: {
            price_per_cm2: 0.5,
            min_margin_percent: 30,
            target_margin_percent: 40,
        },
    });

    // Sync form values when config is loaded
    useEffect(() => {
        if (config) {
            reset({
                price_per_cm2: config.price_per_cm2,
                min_margin_percent: config.min_margin_percent,
                target_margin_percent: config.target_margin_percent,
            });
        }
    }, [config, reset]);

    // Local state to keep track of edited areas
    const [editedAreas, setEditedAreas] = useState<Record<VehicleSize, number>>({
        small: 10000,
        medium: 15000,
        large: 20000,
        extra_large: 25000
    });

    // Sync edited areas when backend data is loaded
    useEffect(() => {
        if (areas) {
            const mappings = { ...defaultAreas };
            areas.forEach((a) => {
                mappings[a.size] = a.area_cm2;
            });
            setEditedAreas(mappings);
        }
    }, [areas]);

    const onConfigSubmit = (data: PaintConfigInput) => {
        updateConfigMutation.mutate({
            price_per_cm2: data.price_per_cm2,
            min_margin_percent: data.min_margin_percent,
            target_margin_percent: data.target_margin_percent,
            is_active: true,
        });
    };

    const handleAreaChange = (size: VehicleSize, val: string) => {
        const num = parseFloat(val);
        setEditedAreas((prev) => ({
            ...prev,
            [size]: isNaN(num) ? 0 : num,
        }));
    };

    const handleSaveArea = (size: VehicleSize) => {
        const area_cm2 = editedAreas[size];
        updateAreaMutation.mutate({
            size,
            area_cm2,
        });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 2,
        }).format(val);
    };

    const isLoading = isLoadingConfig || isLoadingAreas;

    return (
        <div className="space-y-6 w-full max-w-5xl mx-auto pb-12 px-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <PaintBucket className="w-6 h-6 text-indigo-400" />
                        Configurar Precios y Dimensiones
                    </h1>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                    <p className="text-sm text-zinc-400">Cargando configuraciones...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Price Config Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                    <Sliders className="w-4.5 h-4.5 text-indigo-400" />
                                    Costos y Márgenes
                                </CardTitle>
                                <CardDescription className="text-xs text-zinc-400">
                                    Define la tasa por centímetro cuadrado y el margen mínimo permitido para el taller.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onConfigSubmit)} className="space-y-4">
                                    {/* Price per cm2 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="price_per_cm2" className="text-zinc-300 text-xs">
                                            Precio por cm² (COP)
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign className="h-4 w-4 text-zinc-500" />
                                            </div>
                                            <Input
                                                id="price_per_cm2"
                                                type="number"
                                                step="0.01"
                                                placeholder="Ej: 0.50"
                                                className="pl-8 bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                                                {...register("price_per_cm2")}
                                            />
                                        </div>
                                        {errors.price_per_cm2 && (
                                            <p className="text-xs text-red-400">{errors.price_per_cm2.message}</p>
                                        )}
                                    </div>

                                    {/* Min Margin % */}
                                    <div className="space-y-2">
                                        <Label htmlFor="min_margin_percent" className="text-zinc-300 text-xs">
                                            Margen Mínimo (%)
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Percent className="h-3.5 w-3.5 text-zinc-500" />
                                            </div>
                                            <Input
                                                id="min_margin_percent"
                                                type="number"
                                                placeholder="Ej: 30"
                                                className="pl-8 bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                                                {...register("min_margin_percent")}
                                            />
                                        </div>
                                        {errors.min_margin_percent && (
                                            <p className="text-xs text-red-400">{errors.min_margin_percent.message}</p>
                                        )}
                                    </div>

                                    {/* Target Margin % */}
                                    <div className="space-y-2">
                                        <Label htmlFor="target_margin_percent" className="text-zinc-300 text-xs">
                                            Margen Objetivo (%)
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Percent className="h-3.5 w-3.5 text-zinc-500" />
                                            </div>
                                            <Input
                                                id="target_margin_percent"
                                                type="number"
                                                placeholder="Ej: 40"
                                                className="pl-8 bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                                                {...register("target_margin_percent")}
                                            />
                                        </div>
                                        {errors.target_margin_percent && (
                                            <p className="text-xs text-red-400">{errors.target_margin_percent.message}</p>
                                        )}
                                    </div>

                                    {/* Reference Box */}
                                    {config && (
                                        <div className="p-3 border border-white/[0.04] bg-white/[0.01] rounded-lg space-y-1.5 text-xs text-zinc-400">
                                            <span className="font-semibold text-[10px] uppercase tracking-wider text-indigo-400">
                                                Configuración Activa
                                            </span>
                                            <div className="flex justify-between">
                                                <span>Precio/cm²:</span>
                                                <strong className="text-zinc-200">{formatCurrency(config.price_per_cm2)}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Margen mínimo:</span>
                                                <strong className="text-zinc-200">{config.min_margin_percent}%</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Margen objetivo:</span>
                                                <strong className="text-zinc-200">{config.target_margin_percent}%</strong>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={updateConfigMutation.isPending}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                    >
                                        {updateConfigMutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Actualizando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Guardar Configuración
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Size Area Mappings */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                    <Ruler className="w-4.5 h-4.5 text-indigo-400" />
                                    Áreas por Tamaño de Vehículo
                                </CardTitle>
                                <CardDescription className="text-xs text-zinc-400">
                                    Define la superficie estimada en cm² para cada categoría de tamaño de vehículo para que el cálculo base sea preciso.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="border-white/[0.08]">
                                            <TableRow className="hover:bg-transparent border-white/[0.08]">
                                                <TableHead className="text-zinc-400 text-xs">Tamaño</TableHead>
                                                <TableHead className="text-zinc-400 text-xs">Área (cm²)</TableHead>
                                                <TableHead className="text-zinc-400 text-xs text-right">Acción</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(Object.keys(editedAreas) as VehicleSize[]).map((size) => {
                                                const currentArea = areas?.find(a => a.size === size);
                                                const isCustom = !!currentArea;
                                                return (
                                                    <TableRow key={size} className="hover:bg-white/[0.01] border-white/[0.04]">
                                                        <TableCell className="font-semibold text-zinc-200 py-3">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="capitalize">{sizeLabels[size]}</span>
                                                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                                                                    {size}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="number"
                                                                    value={editedAreas[size]}
                                                                    onChange={(e) => handleAreaChange(size, e.target.value)}
                                                                    className="w-36 h-9 bg-white/[0.02] border-white/[0.08] text-zinc-200"
                                                                />
                                                                {!isCustom && (
                                                                    <Badge variant="outline" className="border-yellow-500/20 text-yellow-500/80 bg-yellow-500/5 text-[9px] font-medium leading-none px-1.5 py-0.5">
                                                                        Por Defecto
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3 text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleSaveArea(size)}
                                                                disabled={updateAreaMutation.isPending}
                                                                className="h-8 border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 gap-1.5 cursor-pointer"
                                                            >
                                                                {updateAreaMutation.isPending ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                                                                ) : (
                                                                    <Save className="h-3.5 w-3.5 text-indigo-400" />
                                                                )}
                                                                Guardar
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

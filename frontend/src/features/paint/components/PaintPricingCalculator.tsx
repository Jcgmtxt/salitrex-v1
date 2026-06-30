import { useState, useEffect } from "react";
import { useCars } from "@/features/crm/hooks/use-cars";
import { useCalculatePrice } from "../hooks/use-paint";
import type { Car } from "@/features/crm/types";
import { 
    Car as CarIcon, 
    User, 
    Check, 
    AlertCircle, 
    PaintBucket, 
    Sparkles, 
    Sliders,
    ArrowLeft
} from "lucide-react";
import { SearchInput } from "@/shared/components/SearchInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

interface Props {
    initialCarId?: number;
}

export function PaintPricingCalculator({ initialCarId }: Props) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    // List of cars for autocomplete
    const { data: carsData, isLoading: isLoadingCars } = useCars({
        query: query || undefined,
        limit: 10,
    });

    const cars = carsData?.items ?? [];

    // If an initialCarId is passed, we fetch the car details to select it
    const { data: initialCarData } = useCars({
        limit: 100, // Just a safe fetch to find the specific car in the list, or we can use selectedCar directly
    });

    useEffect(() => {
        if (initialCarId && initialCarData?.items) {
            const foundCar = initialCarData.items.find(c => c.id === initialCarId);
            if (foundCar) {
                setSelectedCar(foundCar);
            }
        }
    }, [initialCarId, initialCarData]);

    // Fetch paint price calculation for the selected car
    const { data: pricing, isLoading: isLoadingPricing, error: pricingError } = useCalculatePrice(
        selectedCar?.id ?? 0
    );

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(val);
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
        <div className="space-y-6 w-full max-w-5xl mx-auto pb-12 px-4 pt-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Inicio
                        </Link>
                        <span>/</span>
                        <span className="text-zinc-200">Calculadora de Pintura</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
                        <PaintBucket className="w-6 h-6 text-indigo-400 animate-pulse" />
                        Calculadora de Pintura
                    </h1>
                </div>
            </div>

            {/* Search Input Card */}
            <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md relative z-30 !overflow-visible">
                <CardContent className="p-4">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                        Buscar Vehículo por Placa, Marca o Propietario
                    </label>
                    <div className="relative">
                        <SearchInput
                            value={query}
                            onChange={setQuery}
                            placeholder="Escribe la placa (ej: ABC-123), marca o dueño del auto..."
                            className="w-full bg-white/[0.01] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        />
                        
                        {/* Dropdown list */}
                        {isFocused && query.length >= 1 && (
                            <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0c0c14] shadow-2xl backdrop-blur-md z-50">
                                {isLoadingCars ? (
                                    <div className="p-4 space-y-2">
                                        <Skeleton className="h-10 w-full bg-white/[0.03]" />
                                        <Skeleton className="h-10 w-full bg-white/[0.03]" />
                                    </div>
                                ) : cars.length === 0 ? (
                                    <div className="p-4 text-center text-zinc-500 text-sm flex items-center justify-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-zinc-600" />
                                        No se encontraron vehículos para "{query}"
                                    </div>
                                ) : (
                                    <div className="py-1">
                                        {cars.map((car) => (
                                            <button
                                                key={car.id}
                                                type="button"
                                                className="w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors flex items-center justify-between group border-b border-white/[0.02] last:border-b-0"
                                                onClick={() => {
                                                    setSelectedCar(car);
                                                    setQuery("");
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                                                        <CarIcon className="h-4 w-4 text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-zinc-200 group-hover:text-white uppercase tracking-wider text-xs">
                                                                {car.license_plate}
                                                            </span>
                                                            <span className="text-zinc-400 text-xs font-medium">
                                                                {car.brand} {car.model}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                                            <User className="h-3 w-3" /> {car.client_name || "Desconocido"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {selectedCar?.id === car.id && (
                                                    <Check className="h-4 w-4 text-indigo-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Left side: Vehicle Card details */}
                <div className="md:col-span-1 space-y-4">
                    {selectedCar ? (
                        <Card className="border-white/[0.08] bg-[#0a0a0f]/40 backdrop-blur-sm shadow-xl">
                            <CardHeader className="pb-3 border-b border-white/[0.04]">
                                <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                                    Información del Vehículo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex flex-col gap-4 mt-1">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-widest font-bold text-sm">
                                            {selectedCar.license_plate}
                                        </Badge>
                                        <Badge className="bg-white/[0.05] border-white/[0.08] text-zinc-400 capitalize">
                                            {selectedCar.color}
                                        </Badge>
                                    </div>
                                    <h3 className="font-bold text-base text-zinc-100">
                                        {selectedCar.brand} {selectedCar.model}
                                    </h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Año {selectedCar.year}</p>
                                </div>

                                <div className="space-y-3 border-t border-white/[0.04] pt-4 text-xs">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" /> Propietario
                                        </span>
                                        <span className="text-zinc-200 font-medium text-sm">{selectedCar.client_name || "Desconocido"}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                                            Categorización de Tamaño
                                        </span>
                                        <span className="text-zinc-200 font-medium text-sm capitalize">
                                            {getVehicleSizeLabel(selectedCar.size)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center text-zinc-500 flex flex-col items-center justify-center min-h-[200px] bg-white/[0.005]">
                            <CarIcon className="h-10 w-10 mb-2.5 opacity-20 text-indigo-400" />
                            <p className="text-xs">Busca y selecciona un auto para cargar sus dimensiones.</p>
                        </div>
                    )}
                </div>

                {/* Right side: Detailed Calculation Card */}
                <div className="md:col-span-2">
                    {selectedCar ? (
                        isLoadingPricing ? (
                            <Card className="border-white/[0.08] bg-[#0a0a0f]/40 p-6 space-y-4">
                                <Skeleton className="h-6 w-1/3 bg-white/[0.04]" />
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full bg-white/[0.02]" />
                                    <Skeleton className="h-10 w-full bg-white/[0.02]" />
                                    <Skeleton className="h-10 w-full bg-white/[0.02]" />
                                </div>
                            </Card>
                        ) : pricingError || !pricing ? (
                            <Card className="border-red-500/20 bg-red-500/[0.02] p-6 text-center text-red-400 text-sm">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                No se pudo calcular el precio del vehículo. Asegúrate de configurar las áreas y costos.
                            </Card>
                        ) : (
                            <Card className="border-white/[0.08] bg-[#0a0a0f]/40 backdrop-blur-sm shadow-xl overflow-hidden">
                                <CardHeader className="border-b border-white/[0.04] pb-3">
                                    <CardTitle className="text-base text-white flex items-center gap-2 font-bold">
                                        <Sliders className="w-4 h-4 text-indigo-400" />
                                        Desglose de Tarifas de Pintura
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="p-6 space-y-6">
                                    {/* Breakdown Items */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.005] flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] uppercase font-semibold text-zinc-500">Tamaño Registrado</p>
                                                <p className="text-zinc-200 font-bold mt-0.5 capitalize">{getVehicleSizeLabel(pricing.car_size)}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.005] flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] uppercase font-semibold text-zinc-500">Área de Superficie</p>
                                                <p className="text-zinc-200 font-bold mt-0.5">{pricing.area_cm2.toLocaleString("es-ES")} cm²</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.005] flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] uppercase font-semibold text-zinc-500">Precio por cm²</p>
                                                <p className="text-zinc-200 font-bold mt-0.5">{formatCurrency(pricing.price_per_cm2)}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.005] flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] uppercase font-semibold text-zinc-500">Costo Base Calculado</p>
                                                <p className="text-zinc-200 font-bold mt-0.5">{formatCurrency(pricing.base_price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Margins Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.005] flex justify-between items-center">
                                            <div>
                                                <p className="text-zinc-400 font-medium text-xs">Margen Mínimo Taller</p>
                                                <p className="text-[10px] text-zinc-500">Rentabilidad mínima aceptada.</p>
                                            </div>
                                            <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-1 font-bold font-mono">
                                                {pricing.min_margin_percent}%
                                            </Badge>
                                        </div>
                                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.005] flex justify-between items-center">
                                            <div>
                                                <p className="text-zinc-400 font-medium text-xs">Margen Objetivo Taller</p>
                                                <p className="text-[10px] text-zinc-500">Rentabilidad ideal del taller.</p>
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 font-bold font-mono">
                                                {pricing.target_margin_percent}%
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Prices display */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Minimum Allowed Price */}
                                        <div className="relative rounded-2xl p-5 overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-500/[0.02] to-amber-500/[0.02] flex flex-col justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-red-400">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Precio Mínimo Permitido</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500 leading-tight">
                                                    Límite inferior absoluto. No vender por debajo de este precio.
                                                </p>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-red-400 text-2xl font-extrabold tracking-tight">
                                                    {formatCurrency(pricing.min_allowed_price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Recommended Target Price */}
                                        <div className="relative rounded-2xl p-5 overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 flex flex-col justify-between gap-3">
                                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-indigo-500),transparent_40%)] opacity-[0.06]" />
                                            <div className="space-y-1 relative z-10">
                                                <div className="flex items-center gap-1.5 text-indigo-400">
                                                    <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Precio Recomendado (Objetivo)</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-400 leading-tight">
                                                    Precio ideal a cobrar para obtener el margen objetivo.
                                                </p>
                                            </div>
                                            <div className="text-left relative z-10">
                                                <p className="text-indigo-400 text-2xl font-extrabold tracking-tight">
                                                    {formatCurrency(pricing.target_allowed_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Negotiation Helper Info */}
                                    <div className="p-4 rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/[0.01] text-xs text-zinc-400 flex items-start gap-2.5">
                                        <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-zinc-300">Rango de Negociación Disponible</p>
                                            <p className="mt-0.5 leading-relaxed">
                                                Puedes negociar libremente con el cliente entre <strong className="text-red-400">{formatCurrency(pricing.min_allowed_price)}</strong> y <strong className="text-indigo-400">{formatCurrency(pricing.target_allowed_price)}</strong> para asegurar el margen requerido por el taller.
                                            </p>
                                        </div>
                                    </div>             
                                </CardContent>
                            </Card>
                        )
                    ) : (
                        <div className="rounded-xl border border-dashed border-white/[0.08] p-12 text-center text-zinc-500 flex flex-col items-center justify-center min-h-[300px] bg-white/[0.005]">
                            <PaintBucket className="h-12 w-12 mb-3.5 opacity-20 text-indigo-400" />
                            <p className="text-sm font-medium">No se ha seleccionado ningún vehículo</p>
                            <p className="text-xs text-zinc-600 mt-1 max-w-sm">
                                Utiliza el buscador superior para seleccionar un vehículo por placa. La calculadora desglosará el área, precio base y precio mínimo permitido en tiempo real.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

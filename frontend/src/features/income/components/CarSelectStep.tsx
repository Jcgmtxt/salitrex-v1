import { useState } from "react";
import { useCars } from "@/features/crm/hooks/use-cars";
import type { Car } from "@/features/crm/types";
import { Car as CarIcon, User, Check, AlertCircle } from "lucide-react";
import { SearchInput } from "@/shared/components/SearchInput";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface Props {
    selectedCar: Car | null;
    onSelectCar: (car: Car) => void;
}

export function CarSelectStep({ selectedCar, onSelectCar }: Props) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    
    const { data, isLoading } = useCars({
        query: query || undefined,
        limit: 10,
    });

    const cars = data?.items ?? [];

    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                    Buscar Vehículo *
                </label>
                <div className="relative">
                    <SearchInput
                        value={query}
                        onChange={setQuery}
                        placeholder="Escribe la placa, marca o modelo del auto..."
                        className="w-full"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    />
                </div>

                {/* Resultados Autocompletables */}
                {isFocused && query.length >= 1 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg border border-white/[0.08] bg-[#0c0c14] shadow-2xl backdrop-blur-md">
                        {isLoading ? (
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-10 w-full bg-white/[0.05]" />
                                <Skeleton className="h-10 w-full bg-white/[0.05]" />
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="p-4 text-center text-zinc-500 text-sm flex items-center justify-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                No se encontraron vehículos para "{query}"
                            </div>
                        ) : (
                            <div className="py-1">
                                {cars.map((car) => (
                                    <button
                                        key={car.id}
                                        type="button"
                                        className="w-full text-left px-4 py-2.5 hover:bg-white/[0.05] transition-colors flex items-center justify-between group border-b border-white/[0.02] last:border-b-0"
                                        onClick={() => onSelectCar(car)}
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

            {/* Vehículo Seleccionado */}
            {selectedCar ? (
                <Card className="border-indigo-500/30 bg-indigo-500/[0.02] backdrop-blur-sm shadow-xl">
                    <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 block mb-1">
                                    Vehículo Seleccionado
                                </span>
                                <h3 className="font-bold text-lg text-white leading-none mb-1.5 uppercase tracking-widest">
                                    {selectedCar.license_plate}
                                </h3>
                                <p className="text-sm text-zinc-300 font-medium">
                                    {selectedCar.brand} {selectedCar.model}
                                </p>
                            </div>
                            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-wider">
                                {selectedCar.color}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/[0.06] pt-3 mt-1">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <User className="h-3.5 w-3.5 text-zinc-500" /> Dueño
                                </span>
                                <span className="text-zinc-200 font-medium text-sm">{selectedCar.client_name || "Desconocido"}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    Tamaño
                                </span>
                                <span className="text-zinc-200 font-medium text-sm capitalize">{selectedCar.size}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="rounded-lg border border-dashed border-white/[0.08] p-8 text-center text-zinc-500 flex flex-col items-center">
                    <CarIcon className="h-10 w-10 mb-2.5 opacity-20 text-indigo-400" />
                    <p className="text-sm">Por favor, busca y selecciona un vehículo para continuar.</p>
                </div>
            )}
        </div>
    );
}

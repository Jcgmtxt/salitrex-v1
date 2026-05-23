import { useState, useMemo } from "react";
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
import { X, User, ExternalLink, Info, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Car } from "../types";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
    cars: Car[];
}

type SortField = "brand" | "license_plate" | "color" | "client_name";
type SortOrder = "asc" | "desc" | null;

export function CarsTable({ cars }: Props) {
    const navigate = useNavigate();
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            if (sortOrder === "asc") {
                setSortOrder("desc");
            } else if (sortOrder === "desc") {
                setSortField(null);
                setSortOrder(null);
            } else {
                setSortOrder("asc");
            }
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const sortedCars = useMemo(() => {
        if (!sortField || !sortOrder) return cars;

        return [...cars].sort((a, b) => {
            let valA = "";
            let valB = "";

            if (sortField === "brand") {
                valA = `${a.brand} ${a.model}`.toLowerCase();
                valB = `${b.brand} ${b.model}`.toLowerCase();
            } else if (sortField === "client_name") {
                valA = (a.client_name || "").toLowerCase();
                valB = (b.client_name || "").toLowerCase();
            } else {
                valA = (a[sortField] || "").toLowerCase();
                valB = (b[sortField] || "").toLowerCase();
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [cars, sortField, sortOrder]);

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40 hover:opacity-100 transition-opacity" />;
        }
        return sortOrder === "asc" ? (
            <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-indigo-400" />
        ) : (
            <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-indigo-400" />
        );
    };

    return (
        <div className="hidden md:flex gap-4 items-start relative transition-all duration-300">
            {/* Tabla Principal */}
            <div className={cn(
                "rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden backdrop-blur-sm transition-all duration-300",
                selectedCar ? "w-2/3" : "w-full"
            )}>
                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/[0.08] hover:bg-transparent">
                            <TableHead 
                                className="text-zinc-400 font-medium cursor-pointer select-none hover:text-zinc-200 transition-colors"
                                onClick={() => handleSort("brand")}
                            >
                                <div className="flex items-center">
                                    Vehículo {renderSortIcon("brand")}
                                </div>
                            </TableHead>
                            <TableHead 
                                className="text-zinc-400 font-medium cursor-pointer select-none hover:text-zinc-200 transition-colors"
                                onClick={() => handleSort("license_plate")}
                            >
                                <div className="flex items-center">
                                    Placa {renderSortIcon("license_plate")}
                                </div>
                            </TableHead>
                            <TableHead 
                                className="text-zinc-400 font-medium cursor-pointer select-none hover:text-zinc-200 transition-colors"
                                onClick={() => handleSort("color")}
                            >
                                <div className="flex items-center">
                                    Color {renderSortIcon("color")}
                                </div>
                            </TableHead>
                            <TableHead 
                                className="text-zinc-400 font-medium cursor-pointer select-none hover:text-zinc-200 transition-colors"
                                onClick={() => handleSort("client_name")}
                            >
                                <div className="flex items-center">
                                    Cliente {renderSortIcon("client_name")}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedCars.map((car) => (
                            <TableRow 
                                key={car.id} 
                                className={cn(
                                    "border-white/[0.08] cursor-pointer transition-colors",
                                    selectedCar?.id === car.id 
                                        ? "bg-indigo-500/10 hover:bg-indigo-500/15" 
                                        : "hover:bg-white/[0.04]"
                                )}
                                onClick={() => setSelectedCar(car)}
                            >
                                <TableCell className="font-medium text-zinc-200">
                                    <div className="flex flex-col">
                                        <span>{car.brand} {car.model}</span>
                                        <span className="text-xs text-zinc-500 font-normal">{car.year}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-zinc-300">
                                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-wider font-semibold">
                                        {car.license_plate}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-300 capitalize">{car.color}</TableCell>
                                <TableCell className="text-zinc-300">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-zinc-500" />
                                        {car.client_name || "Desconocido"}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Panel Lateral Integrado */}
            {selectedCar && (
                <div className="w-1/3 shrink-0 rounded-xl border border-white/[0.08] bg-[#0a0a0f] overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-6">
                    <div className="p-4 border-b border-white/[0.08] flex flex-col gap-3 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-white text-lg leading-tight uppercase tracking-widest">{selectedCar.license_plate}</h3>
                                <p className="text-sm text-zinc-400">
                                    {selectedCar.brand} {selectedCar.model}
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                                onClick={() => setSelectedCar(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200"
                                onClick={() => navigate({ to: `/clients/${selectedCar.client_id}` })}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ir al Cliente
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        
                        {/* Detalles del vehículo que no están en la tabla */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                                <Info className="h-4 w-4 text-indigo-400" />
                                Detalles Adicionales
                            </h4>
                            
                            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Tamaño</span>
                                    <span className="text-zinc-200 capitalize">{selectedCar.size}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Año de registro</span>
                                    <span className="text-zinc-200">{new Date(selectedCar.created_at).getFullYear()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dueño */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                                <User className="h-4 w-4 text-indigo-400" />
                                Cliente
                            </h4>
                            
                            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3">
                                <p className="text-zinc-200 font-medium mb-1">{selectedCar.client_name || "Desconocido"}</p>
                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                    Hacer click en "Ir al Cliente" para ver detalles de contacto.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { User, Info } from "lucide-react";
import type { Car } from "../types";

interface Props {
    cars: Car[];
}

export function CarsMobileList({ cars }: Props) {
    const navigate = useNavigate();

    return (
        <div className="grid gap-3 md:hidden">
            {cars.map((car) => (
                <Card 
                    key={car.id} 
                    className="border-white/[0.08] bg-white/[0.02] shadow-none backdrop-blur-sm cursor-pointer active:bg-white/[0.05] transition-colors"
                    onClick={() => navigate({ to: `/clients/${car.client_id}` })}
                >
                    <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-zinc-200 leading-none mb-1.5 uppercase tracking-wider">{car.license_plate}</h3>
                                <p className="text-xs text-zinc-500">{car.brand} {car.model}</p>
                            </div>
                            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 shrink-0 capitalize">
                                {car.color}
                            </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-1 border-t border-white/[0.04] pt-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <Info className="h-3 w-3" /> Año
                                </span>
                                <span className="text-zinc-300">{car.year}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <User className="h-3 w-3" /> Cliente
                                </span>
                                <span className="text-zinc-300 truncate pr-2">{car.client_name || 'Desconocido'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

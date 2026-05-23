import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Edit } from "lucide-react";
import type { Car, Client } from "../types";
import { CarDialog } from "./CarDialog";
import { useAuthStore } from "@/features/auth/store";

interface Props {
    car: Car;
    client: Client;
}

export function CarCard({ car, client }: Props) {
    const role = useAuthStore((state) => state.role);

    return (
        <div className="p-4 rounded-lg border border-white/[0.08] bg-white/[0.02] flex flex-col gap-2 relative group transition-colors hover:bg-white/[0.04]">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-zinc-200">{car.brand} {car.model}</h4>
                    <p className="text-sm text-zinc-400">{car.year} • <span className="capitalize">{car.color}</span></p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-wider">
                        {car.license_plate}
                    </Badge>
                </div>
            </div>
            
            <div className="mt-2 text-xs text-zinc-500 flex items-center justify-between border-t border-white/[0.04] pt-2">
                <span className="capitalize">Tamaño: {car.size}</span>
                
                {role === "admin" && (
                    <CarDialog clientId={client.id} clientName={client.name} car={car}>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-white/[0.1] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Edit className="h-3.5 w-3.5" />
                        </Button>
                    </CarDialog>
                )}
            </div>
        </div>
    );
}

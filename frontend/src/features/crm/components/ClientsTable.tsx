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
import { Car, X, Plus, ExternalLink } from "lucide-react";
import type { Client } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { CarDialog } from "./CarDialog";

interface Props {
    clients: Client[];
}

export function ClientsTable({ clients }: Props) {
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    return (
        <div className="hidden md:flex gap-4 items-start relative transition-all duration-300">
            {/* Tabla Principal */}
            <div className={cn(
                "rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden backdrop-blur-sm transition-all duration-300",
                selectedClient ? "w-2/3" : "w-full"
            )}>
                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/[0.08] hover:bg-transparent">
                            <TableHead className="text-zinc-400 font-medium">Nombre</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Documento</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Teléfono</TableHead>
                            <TableHead className="text-zinc-400 font-medium text-right">Vehículos</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow
                                key={client.id}
                                className={cn(
                                    "border-white/[0.08] cursor-pointer transition-colors",
                                    selectedClient?.id === client.id
                                        ? "bg-indigo-500/10 hover:bg-indigo-500/15"
                                        : "hover:bg-white/[0.04]"
                                )}
                                onClick={() => setSelectedClient(client)}
                                onDoubleClick={() => navigate({ to: `/clients/${client.id}` })}
                            >
                                <TableCell className="font-medium text-zinc-200">
                                    <div className="flex flex-col">
                                        <span>{client.name}</span>
                                        <span className="text-xs text-zinc-500 font-normal">{client.email || 'Sin correo'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-zinc-300">
                                    {client.document_type} {client.identity_number}
                                </TableCell>
                                <TableCell className="text-zinc-300">{client.phone}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20">
                                        <Car className="mr-1.5 h-3 w-3" />
                                        {client.cars?.length || 0}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Panel Lateral Integrado */}
            {selectedClient && (
                <div className="w-1/3 shrink-0 rounded-xl border border-white/[0.08] bg-[#0a0a0f] overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-6">
                    <div className="p-4 border-b border-white/[0.08] flex flex-col gap-3 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-white text-lg leading-tight">{selectedClient.name}</h3>
                                <p className="text-sm text-zinc-400">
                                    Vehículos ({selectedClient.cars?.length || 0})
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                                onClick={() => setSelectedClient(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200"
                                onClick={() => navigate({ to: `/clients/${selectedClient.id}` })}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver Cliente
                            </Button>
                            <CarDialog clientId={selectedClient.id} clientName={selectedClient.name}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                                >
                                    <Plus className="h-4 w-4" />
                                    Nuevo Vehículo
                                </Button>
                            </CarDialog>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {selectedClient.cars && selectedClient.cars.length > 0 ? (
                            selectedClient.cars.map((car) => (
                                <Card
                                    key={car.id}
                                    className="border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-pointer shadow-none"
                                    onClick={() => navigate({ to: `/cars/${car.id}` as any })}
                                >
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-semibold text-zinc-200 leading-none">
                                                {car.brand} {car.model}
                                            </h4>
                                            <p className="text-xs text-zinc-500">
                                                {car.year} • {car.color}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 bg-indigo-500/10">
                                            {car.license_plate}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-10 text-zinc-500 flex flex-col items-center">
                                <Car className="h-10 w-10 mb-3 opacity-20" />
                                <p className="text-sm mb-4">No hay vehículos registrados.</p>
                                <CarDialog clientId={selectedClient.id} clientName={selectedClient.name}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar vehículo
                                    </Button>
                                </CarDialog>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

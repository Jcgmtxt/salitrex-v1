import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Car } from "lucide-react";
import type { Client } from "../types";

interface Props {
    clients: Client[];
}

export function ClientsMobileList({ clients }: Props) {
    const navigate = useNavigate();

    return (
        <div className="grid gap-3 md:hidden">
            {clients.map((client) => (
                <Card 
                    key={client.id} 
                    className="border-white/[0.08] bg-white/[0.02] shadow-none backdrop-blur-sm cursor-pointer active:bg-white/[0.05] transition-colors"
                    onClick={() => navigate({ to: `/clients/${client.id}` as any })}
                >
                    <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-zinc-200 leading-none mb-1.5">{client.name}</h3>
                                <p className="text-xs text-zinc-500">{client.email || 'Sin correo'}</p>
                            </div>
                            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shrink-0">
                                <Car className="mr-1.5 h-3 w-3" />
                                {client.cars?.length || 0}
                            </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Documento</span>
                                <span className="text-zinc-300">{client.document_type} {client.identity_number}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Teléfono</span>
                                <span className="text-zinc-300">{client.phone}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

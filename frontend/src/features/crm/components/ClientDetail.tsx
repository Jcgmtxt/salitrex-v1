import { useClient } from "../hooks/use-clients";
import { Link } from "@tanstack/react-router";
import { Edit2, Car, User, Mail, Phone, CreditCard, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ClientDialog } from "./ClientDialog";
import { CarDialog } from "./CarDialog";
import { CarCard } from "./CarCard";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ClientDetail({ clientId }: { clientId: number }) {
    const { data: client, isLoading, error } = useClient(clientId);

    if (isLoading) {
        return <ClientDetailSkeleton />;
    }

    if (error || !client) {
        return (
            <div className="p-8 text-center text-red-400">
                <p>Error al cargar el cliente. {error?.message}</p>
                <Link to="/clients" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
                    Volver a clientes
                </Link>
            </div>
        );
    }
    // TODO: Arreglar para que el que muestre las breadcrumbs sea en el layout principal
    // y se pueda navegar desde ahi a los clientes

    return (
        <div className="space-y-6 w-full max-w-6xl mx-auto pb-10 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: User Data & Cars */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Datos del Usuario */}
                    <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-400" />
                                Datos del usuario
                            </CardTitle>
                            <ClientDialog client={client}>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/[0.05]">
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                            </ClientDialog>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Nombre</p>
                                <p className="text-zinc-200 font-medium">{client.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Documento ({client.document_type.toUpperCase()})</p>
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <CreditCard className="w-4 h-4 text-zinc-400" />
                                    {client.identity_number}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Teléfono</p>
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <Phone className="w-4 h-4 text-zinc-400" />
                                    {client.phone}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Correo electrónico</p>
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <Mail className="w-4 h-4 text-zinc-400" />
                                    {client.email || <span className="text-zinc-500 italic">No registrado</span>}
                                </div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Registrado el</p>
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <Calendar className="w-4 h-4 text-zinc-400" />
                                    {new Date(client.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Autos Asociados */}
                    <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Car className="w-5 h-5 text-indigo-400" />
                                Autos asociados
                            </CardTitle>
                            <CarDialog clientId={client.id} clientName={client.name}>
                                <Button variant="outline" size="sm" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 h-8">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Auto
                                </Button>
                            </CarDialog>
                        </CardHeader>
                        <CardContent className="mt-4">
                            {client.cars && client.cars.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {client.cars.map((car) => (
                                        <CarCard key={car.id} car={car} client={client} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-zinc-500 border border-dashed border-white/[0.1] rounded-lg">
                                    <Car className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p>No hay vehículos registrados para este cliente.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Entradas (Incomes) */}
                <div className="space-y-6">
                    <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md h-full min-h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-400" />
                                Entradas recientes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-zinc-500">
                                <p className="text-sm">Las entradas de servicio asociadas aparecerán aquí.</p>
                                <p className="text-xs mt-2 opacity-60">(Próximamente en HU-14)</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ClientDetailSkeleton() {
    return (
        <div className="space-y-6 w-full max-w-6xl mx-auto pb-10">
            <Skeleton className="h-5 w-40 bg-white/[0.05]" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-[250px] w-full rounded-xl bg-white/[0.05]" />
                    <Skeleton className="h-[200px] w-full rounded-xl bg-white/[0.05]" />
                </div>
                <div>
                    <Skeleton className="h-[400px] w-full rounded-xl bg-white/[0.05]" />
                </div>
            </div>
        </div>
    );
}

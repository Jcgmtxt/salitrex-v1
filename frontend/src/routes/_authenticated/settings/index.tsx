import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { PaintBucket, Users, ChevronRight, Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings/")({
    component: () => (
        <div className="space-y-6 w-full max-w-5xl mx-auto pb-12 px-4 pt-4">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-indigo-400" />
                    Panel de Configuración
                </h1>
                <p className="text-zinc-400 text-sm">
                    Administra los parámetros generales del taller, usuarios y tarifas de servicios.
                </p>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Users Management Settings Card */}
                <Link to="/settings/users" className="block group">
                    <Card className="h-full bg-[#0a0a0f]/40 border-white/[0.08] backdrop-blur-sm group-hover:border-indigo-500/30 transition-all duration-300 cursor-pointer">
                        <CardHeader className="pb-2">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                                <Users className="h-5 w-5 text-indigo-400" />
                            </div>
                            <CardTitle className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                                Gestión de Usuarios
                                <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </CardTitle>
                            <CardDescription className="text-xs text-zinc-400 mt-1">
                                Ver, crear y gestionar las cuentas y accesos de los operadores del taller.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                {/* Paint Config Settings Card */}
                <Link to="/settings/paint-config" className="block group">
                    <Card className="h-full bg-[#0a0a0f]/40 border-white/[0.08] backdrop-blur-sm group-hover:border-indigo-500/30 transition-all duration-300 cursor-pointer">
                        <CardHeader className="pb-2">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                                <PaintBucket className="h-5 w-5 text-indigo-400" />
                            </div>
                            <CardTitle className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                                Tarifas de Pintura
                                <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </CardTitle>
                            <CardDescription className="text-xs text-zinc-400 mt-1">
                                Configurar precios por cm², márgenes de ganancia y dimensiones por tamaño de vehículo.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    ),
});

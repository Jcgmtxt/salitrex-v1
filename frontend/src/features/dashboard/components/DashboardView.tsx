import { useIncomes } from "@/features/income/hooks/use-incomes";
import { useClients } from "@/features/crm/hooks/use-clients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { 
    Wrench, 
    Users, 
    PaintBucket, 
    TrendingUp, 
    Calendar, 
    ArrowRight, 
    Plus,
    UserPlus,
    Loader2
} from "lucide-react";

export function DashboardView() {
    // Fetch incomes (latest 100 to calculate active/today stats)
    const { data: incomesData, isLoading: isLoadingIncomes } = useIncomes({
        limit: 100,
    });

    // Fetch clients (limit 1 is enough to get total count in metadata)
    const { data: clientsData, isLoading: isLoadingClients } = useClients({
        limit: 1,
    });

    const isLoading = isLoadingIncomes || isLoadingClients;

    // Calculations
    const totalClients = clientsData?.total ?? 0;
    
    const activeVehicles = incomesData?.items?.filter(
        (income) => !income.exit_date_time
    ) ?? [];

    const totalActiveCount = activeVehicles.length;

    // Count entries created today (UTC local match)
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const entriesTodayCount = incomesData?.items?.filter((income) => {
        const dateStr = income.income_date_time || income.created_at;
        if (!dateStr) return false;
        const entryDate = new Date(dateStr);
        return (
            entryDate.getFullYear() === todayYear &&
            entryDate.getMonth() === todayMonth &&
            entryDate.getDate() === todayDay
        );
    }).length ?? 0;

    // Get the latest 5 entries sorted by entry date/id descending
    const recentEntries = [...(incomesData?.items ?? [])]
        .sort((a, b) => {
            const dateA = new Date(a.income_date_time || a.created_at).getTime();
            const dateB = new Date(b.income_date_time || b.created_at).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6 w-full max-w-5xl mx-auto pb-12 px-4 pt-4">
            {/* Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Resumen del Taller
                    </h1>
                    <p className="text-zinc-400 text-xs">
                        Bienvenido al panel de control de Salitrex. Aquí está el estado de hoy.
                    </p>
                </div>
                <div className="text-zinc-500 text-xs flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] py-1.5 px-3 rounded-lg font-mono">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {new Date().toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                    <p className="text-sm text-zinc-400">Cargando datos del taller...</p>
                </div>
            ) : (
                <>
                    {/* KPIs Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* KPI 1: Vehicles in Workshop */}
                        <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Wrench className="w-20 h-20 text-indigo-500" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                                    Vehículos en Taller
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <p className="text-3xl font-extrabold text-white tracking-tight">
                                    {totalActiveCount}
                                </p>
                                <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-indigo-400" />
                                    Autos activos siendo atendidos en taller
                                </p>
                            </CardContent>
                        </Card>

                        {/* KPI 2: Total Clients */}
                        <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Users className="w-20 h-20 text-indigo-500" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                                    Clientes Registrados
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <p className="text-3xl font-extrabold text-white tracking-tight">
                                    {totalClients}
                                </p>
                                <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                                    Cartera total de clientes en CRM
                                </p>
                            </CardContent>
                        </Card>

                        {/* KPI 3: Today's Entries */}
                        <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Calendar className="w-20 h-20 text-indigo-500" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                                    Entradas del Día
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <p className="text-3xl font-extrabold text-white tracking-tight">
                                    {entriesTodayCount}
                                </p>
                                <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-indigo-400" />
                                    Ingresos registrados en la fecha de hoy
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Side: Recent Entries list */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="bg-[#0a0a0f]/40 border-white/[0.08] backdrop-blur-sm shadow-xl">
                                <CardHeader className="border-b border-white/[0.04] pb-3 flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <CardTitle className="text-base text-white font-bold flex items-center gap-2">
                                            <Wrench className="w-4 h-4 text-indigo-400" />
                                            Últimas Entradas Registradas
                                        </CardTitle>
                                        <CardDescription className="text-[10px] text-zinc-500">
                                            Actividad reciente de ingresos al taller automotriz.
                                        </CardDescription>
                                    </div>
                                    <Link to="/income">
                                        <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-white/[0.02] cursor-pointer">
                                            Ver todas
                                            <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {recentEntries.length === 0 ? (
                                        <div className="p-8 text-center text-zinc-500 text-xs">
                                            No hay entradas registradas recientemente.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/[0.04]">
                                            {recentEntries.map((income) => (
                                                <Link 
                                                    key={income.id} 
                                                    to="/income/$incomeId" 
                                                    params={{ incomeId: String(income.id) }}
                                                    className="flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors group cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white/[0.02] border border-white/[0.06] py-1 px-2.5 rounded-lg text-xs font-mono font-bold text-zinc-200 tracking-wider">
                                                            {income.car?.license_plate}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                                                                {income.car?.client_name || "Cliente General"}
                                                            </p>
                                                            <p className="text-[10px] text-zinc-500">
                                                                {formatDate(income.income_date_time || income.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {income.exit_date_time ? (
                                                            <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[9px] font-bold py-0.5 px-2">
                                                                Entregado
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold py-0.5 px-2">
                                                                En taller
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Side: Quick Actions Panel */}
                        <div className="lg:col-span-1 space-y-4">
                            <Card className="bg-[#0a0a0f]/40 border-white/[0.08] backdrop-blur-sm shadow-xl">
                                <CardHeader className="border-b border-white/[0.04] pb-3">
                                    <CardTitle className="text-base text-white font-bold">
                                        Accesos Rápidos
                                    </CardTitle>
                                    <CardDescription className="text-[10px] text-zinc-500">
                                        Atajos para las tareas operativas más comunes.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {/* Action 1: Registrar Entrada */}
                                    <Link to="/income">
                                        <Button className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-600/25 h-10 text-xs font-semibold justify-start gap-2 cursor-pointer transition-all">
                                            <Plus className="w-4 h-4" />
                                            Registrar Entrada
                                        </Button>
                                    </Link>

                                    {/* Action 2: Nuevo Cliente */}
                                    <Link to="/clients">
                                        <Button className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-600/25 h-10 text-xs font-semibold justify-start gap-2 cursor-pointer transition-all">
                                            <UserPlus className="w-4 h-4" />
                                            Nuevo Cliente
                                        </Button>
                                    </Link>

                                    {/* Action 3: Calcular Precio Pintura */}
                                    <Link to="/paint">
                                        <Button className="w-full bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-600/25 h-10 text-xs font-semibold justify-start gap-2 cursor-pointer transition-all">
                                            <PaintBucket className="w-4 h-4" />
                                            Calcular Precio Pintura
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Paintbrush, ShieldCheck, Clock, ArrowRight } from "lucide-react";

export function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Background Gradient Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Sistema en línea</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Salitrex <br />
                        <span className="text-primary italic">Expertos en Pintura Automotriz</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Gestión inteligente para tu taller. Control total sobre ingresos de vehículos, procesos de pintura y reportes de entrega detallados.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <Button size="lg" className="h-12 px-8 text-base font-semibold transition-all hover:scale-105">
                            Nueva Orden de Trabajo
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold backdrop-blur-sm transition-all hover:bg-accent/50 hover:scale-105">
                            Ver Reportes del Día
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats/Quick Features */}
            <section className="py-12 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { label: "Vehículos Hoy", value: "12", icon: Car },
                            { label: "En Proceso", value: "8", icon: Paintbrush },
                            { label: "Entregas Listas", value: "4", icon: ShieldCheck },
                            { label: "Tiempo Promedio", value: "3.5 Días", icon: Clock },
                        ].map((stat, i) => (
                            <Card key={i} className="bg-card/40 backdrop-blur-md border border-border/50 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                                <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <stat.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 pt-0">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Actions Grid */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="group relative overflow-hidden h-[400px] border-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative h-full p-8 flex flex-col justify-end z-10">
                                <h3 className="text-3xl font-bold mb-4">Módulo de Pintura</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Configura áreas, tamaños de piezas y calcula presupuestos exactos con nuestro sistema automatizado de costeo.
                                </p>
                                <Button className="w-fit">Explorar Módulo</Button>
                            </div>
                        </Card>

                        <Card className="group relative overflow-hidden h-[400px] border-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-600/20 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative h-full p-8 flex flex-col justify-end z-10">
                                <h3 className="text-3xl font-bold mb-4">Registro CRM</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Gestión completa de clientes y vehículos. Mantén un historial detallado de cada servicio realizado.
                                </p>
                                <Button variant="outline" className="w-fit backdrop-blur-md">Ir a Clientes</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <footer className="py-8 mt-auto border-t border-border/50">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-medium">
                    Salitrex © {new Date().getFullYear()} - Sistema de Gestión de Taller
                </div>
            </footer>
        </div>
    );
}

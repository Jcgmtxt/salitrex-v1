import { LogOut, Wrench, ChevronRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { NAVIGATION_ITEMS } from "@/shared/config/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/store";

export function TopHeader() {
    const { name, email, role, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const currentNavItem = NAVIGATION_ITEMS.find((item) =>
        location.pathname.startsWith(item.to)
    );
    const CurrentIcon = currentNavItem?.icon;

    const handleLogout = () => {
        clearAuth();
        navigate({ to: "/login" });
    };

    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "U";

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/[0.08] bg-[#0a0a0f]/80 px-4 md:px-6 backdrop-blur-md">
            {/* Logo en Mobile (Oculto en Desktop ya que el Sidebar lo tiene) */}
            <div className="flex items-center gap-2 md:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                    <Wrench className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="font-semibold text-white">Salitrex</span>
            </div>

            {/* Espaciador y Breadcrumb en Desktop */}
            <div className="hidden md:flex flex-1 items-center px-4">
                {currentNavItem && (
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Link 
                            to="/dashboard" 
                            className="hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-sm"
                            title="Ir al Dashboard"
                        >
                            <Wrench className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                        <Link 
                            to={currentNavItem.to}
                            className="flex items-center gap-2 font-medium text-white bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.08] hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            {CurrentIcon && <CurrentIcon className="h-3.5 w-3.5 text-indigo-400" />}
                            {currentNavItem.name}
                        </Link>
                    </div>
                )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4 ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-10 w-10 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06]"
                        >
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-indigo-600/20 text-indigo-400">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 border-white/[0.08] bg-[#13131a] text-zinc-300"
                        align="end"
                        forceMount
                    >
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">
                                    {name || "Usuario"}
                                </p>
                                <p className="text-xs leading-none text-zinc-500">
                                    {email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/[0.08]" />
                        {role === "admin" && (
                            <DropdownMenuItem asChild className="focus:bg-white/[0.06] focus:text-white cursor-pointer md:hidden">
                                <Link to="/settings">Configuración</Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

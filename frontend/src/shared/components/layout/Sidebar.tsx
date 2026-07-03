import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Wrench, ChevronLeft, ChevronRight } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/shared/config/navigation";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const { role } = useAuthStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Filtramos los items de navegación según el rol del usuario
    const visibleItems = NAVIGATION_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(role as "admin" | "operator")
    );

    return (
        <aside
            className={cn(
                "hidden flex-col border-r border-white/[0.08] bg-[#0a0a0f] md:flex transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[72px]" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className={cn(
                "flex h-16 items-center border-b border-white/[0.08] transition-all duration-300",
                isCollapsed ? "justify-center px-0" : "gap-3 px-6"
            )}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                    <Wrench className="h-4 w-4 text-indigo-400" />
                </div>
                {!isCollapsed && (
                    <span className="text-lg font-semibold text-white tracking-tight truncate">
                        Salitrex
                    </span>
                )}
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto py-4 px-3 overflow-x-hidden">
                <nav className="flex flex-col gap-1.5">
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                title={isCollapsed ? item.name : undefined}
                                className={cn(
                                    "group flex items-center rounded-lg py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white",
                                    isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                                )}
                                activeProps={{
                                    className:
                                        "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/15 hover:text-indigo-300",
                                }}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Collapse Toggle */}
            <div className="p-3 border-t border-white/[0.08]">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                    className={cn(
                        "flex w-full items-center rounded-lg py-2.5 text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-white",
                        isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5 shrink-0" />
                    ) : (
                        <ChevronLeft className="h-5 w-5 shrink-0" />
                    )}
                    {!isCollapsed && <span className="text-sm font-medium truncate">Minimizar</span>}
                </button>
            </div>
        </aside>
    );
}

import { Link } from "@tanstack/react-router";
import { NAVIGATION_ITEMS } from "@/shared/config/navigation";
import { useAuthStore } from "@/features/auth/store";

export function BottomNav() {
    const { role } = useAuthStore();

    // Filtramos los items de navegación según el rol del usuario
    const visibleItems = NAVIGATION_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(role as "admin" | "operator")
    );

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-around border-t border-white/[0.08] bg-black/60 px-2 backdrop-blur-lg md:hidden">
            {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="flex flex-col items-center justify-center gap-1 w-16 h-full text-zinc-500 transition-colors hover:text-zinc-300"
                        activeProps={{
                            className: "text-indigo-400",
                        }}
                    >
                        {({ isActive }) => (
                            <>
                                <div
                                    className={`flex items-center justify-center rounded-xl p-1 transition-all ${
                                        isActive ? "bg-indigo-500/20" : "bg-transparent"
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span
                                    className={`text-[10px] font-medium leading-none ${
                                        isActive ? "text-indigo-400" : ""
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

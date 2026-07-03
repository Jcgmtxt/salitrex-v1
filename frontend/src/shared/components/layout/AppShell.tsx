import { TopHeader } from "./TopHeader";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0f] text-white">
            {/* Sidebar (solo visible en Desktop) */}
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Header Superior (visible en Mobile y Desktop) */}
                <TopHeader />

                {/* Contenido Principal con scroll */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-24 md:pb-6 relative">
                    {children}
                </main>
            </div>

            {/* Navegación Inferior (solo visible en Mobile) */}
            <BottomNav />
        </div>
    );
}

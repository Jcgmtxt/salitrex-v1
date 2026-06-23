import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/users")({
    component: () => (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
                <p className="text-zinc-500 text-sm">Feature 6 (HU-20) — Pendiente de implementación</p>
            </div>
        </div>
    ),
});

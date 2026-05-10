import { createFileRoute } from "@tanstack/react-router";

/**
 * Placeholder del Dashboard — HU-23.
 * Se implementará en la Feature 7.
 */
export const Route = createFileRoute("/_authenticated/dashboard")({
    component: () => (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-zinc-500 text-sm">HU-23 — Pendiente de implementación</p>
            </div>
        </div>
    ),
});

import { Eye, EyeOff, Loader2, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useLogin } from "../hooks/use-login";

export function LoginPage() {
    const { form, onSubmit, isPending, serverError } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            {/* Fondo con gradiente sutil */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15), transparent)",
                }}
            />

            <div className="w-full max-w-sm space-y-8">
                {/* ── Logo ── */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                        <Wrench className="h-7 w-7 text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Salitrex
                        </h1>
                        <p className="text-sm text-zinc-500 mt-0.5">
                            Sistema de Gestión de Taller
                        </p>
                    </div>
                </div>

                {/* ── Tarjeta del formulario ── */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
                    <form onSubmit={onSubmit} noValidate className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="login-email"
                                className="text-sm font-medium text-zinc-300"
                            >
                                Correo electrónico
                            </Label>
                            <Input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                placeholder="operador@taller.com"
                                aria-invalid={!!errors.email}
                                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/60"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-400 mt-1" role="alert">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="login-password"
                                className="text-sm font-medium text-zinc-300"
                            >
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    aria-invalid={!!errors.password}
                                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/60 pr-10"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    id="toggle-password-visibility"
                                    aria-label={
                                        showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                                    }
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-400 mt-1" role="alert">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Error del servidor */}
                        {serverError && (
                            <div
                                role="alert"
                                className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-400"
                            >
                                {serverError}
                            </div>
                        )}

                        {/* Botón submit */}
                        <Button
                            id="login-submit"
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all duration-200 disabled:opacity-60"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Iniciando sesión…
                                </>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import type { Income } from "../types";
import { useUpdateIncome } from "../hooks/use-incomes";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Loader2 } from "lucide-react";

interface Props {
    income: Income;
    children: React.ReactNode;
}

function formatForDateTimeInput(dateStr?: string | null) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditIncomeDialog({ income, children }: Props) {
    const [open, setOpen] = useState(false);
    const updateMutation = useUpdateIncome();

    const [notes, setNotes] = useState(income.notes || "");
    const [agreedExitDate, setAgreedExitDate] = useState(
        formatForDateTimeInput(income.agreed_exit_date_time)
    );
    const [isDelivered, setIsDelivered] = useState(!!income.exit_date_time);
    const [exitDate, setExitDate] = useState(
        formatForDateTimeInput(income.exit_date_time) || formatForDateTimeInput(new Date().toISOString())
    );

    useEffect(() => {
        if (open) {
            setNotes(income.notes || "");
            setAgreedExitDate(formatForDateTimeInput(income.agreed_exit_date_time));
            setIsDelivered(!!income.exit_date_time);
            setExitDate(
                formatForDateTimeInput(income.exit_date_time) || formatForDateTimeInput(new Date().toISOString())
            );
        }
    }, [open, income]);

    const handleSwitchChange = (checked: boolean) => {
        setIsDelivered(checked);
        if (checked && !exitDate) {
            setExitDate(formatForDateTimeInput(new Date().toISOString()));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data: Partial<Income> = {
            notes: notes.trim() || null,
            agreed_exit_date_time: agreedExitDate ? new Date(agreedExitDate).toISOString() : null,
            exit_date_time: isDelivered 
                ? (exitDate ? new Date(exitDate).toISOString() : new Date().toISOString()) 
                : null
        };

        updateMutation.mutate(
            { id: income.id, data },
            {
                onSuccess: () => {
                    setOpen(false);
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-white/[0.08] sm:max-w-md text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        Editar Registro de Entrada
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-xs">
                        Modifica los detalles del ingreso del vehículo {income.car?.license_plate}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Observaciones */}
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-notes" className="text-zinc-300 text-xs font-semibold">
                            Observaciones de Entrada
                        </Label>
                        <Textarea
                            id="edit-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ej: Rayón en puerta, falta rueda de repuesto..."
                            className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 min-h-[90px] text-sm"
                        />
                    </div>

                    {/* Fecha de Salida Acordada */}
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-agreed-exit" className="text-zinc-300 text-xs font-semibold">
                            Fecha/Hora Estimada de Salida
                        </Label>
                        <Input
                            id="edit-agreed-exit"
                            type="datetime-local"
                            value={agreedExitDate}
                            onChange={(e) => setAgreedExitDate(e.target.value)}
                            className="bg-white/[0.02] border-white/[0.08] text-zinc-200 text-sm"
                        />
                    </div>

                    {/* Entregar Vehículo Switch */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.01]">
                        <div className="space-y-0.5">
                            <Label htmlFor="edit-delivered" className="text-zinc-200 text-xs font-semibold cursor-pointer">
                                Marcar como Entregado
                            </Label>
                            <p className="text-[10px] text-zinc-500 leading-none">
                                Registra la salida definitiva del taller.
                            </p>
                        </div>
                        <Switch
                            id="edit-delivered"
                            checked={isDelivered}
                            onCheckedChange={handleSwitchChange}
                        />
                    </div>

                    {/* Fecha de Salida Real */}
                    {isDelivered && (
                        <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                            <Label htmlFor="edit-exit-date" className="text-zinc-300 text-xs font-semibold">
                                Fecha/Hora de Entrega Real
                            </Label>
                            <Input
                                id="edit-exit-date"
                                type="datetime-local"
                                value={exitDate}
                                onChange={(e) => setExitDate(e.target.value)}
                                className="bg-white/[0.02] border-white/[0.08] text-zinc-200 text-sm"
                                required
                            />
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.04]">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200 text-xs"
                            disabled={updateMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 text-xs px-4"
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

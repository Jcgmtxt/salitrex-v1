import { AlertCircle } from "lucide-react";

interface Props {
    isEnTaller: boolean;
}

export function IncomeDeliveredAlert({ isEnTaller }: Props) {
    if (isEnTaller) return null;

    return (
        <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-xl text-xs text-amber-300 flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
                <p className="font-semibold text-[13px]">Vehículo Entregado</p>
                <p className="text-zinc-400 text-xs">
                    Este registro de entrada está cerrado porque el auto ya fue entregado. La información general está bloqueada y no se puede modificar, pero todavía es posible agregar notas a la bitácora e incorporar más fotos del proceso o salida.
                </p>
            </div>
        </div>
    );
}

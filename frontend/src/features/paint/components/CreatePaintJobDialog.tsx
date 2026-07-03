import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useCalculatePrice, useCreatePaintJob } from "../hooks/use-paint";
import { PaintBucket, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

const paintJobSchema = z.object({
    paint_type: z.string().min(2, "El tipo de pintura debe tener al menos 2 caracteres"),
    negotiated_price: z.coerce.number().min(1, "El precio negociado debe ser mayor a 0"),
});

type PaintJobInput = z.infer<typeof paintJobSchema>;

interface Props {
    incomeId: number;
    carId: number;
    trigger?: React.ReactNode;
}

export function CreatePaintJobDialog({ incomeId, carId, trigger }: Props) {
    const [open, setOpen] = useState(false);
    
    // Fetch pricing calculator limits for this car
    const { data: pricing, isLoading: isLoadingPricing } = useCalculatePrice(carId);
    
    // Mutation hook to create the job
    const createJobMutation = useCreatePaintJob(incomeId);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<PaintJobInput>({
        resolver: zodResolver(paintJobSchema),
        defaultValues: {
            paint_type: "",
            negotiated_price: 0,
        },
    });

    const negotiatedPrice = watch("negotiated_price") || 0;

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            reset({
                paint_type: "",
                negotiated_price: 0,
            });
        } else if (pricing) {
            // Suggest the recommended target price as default negotiated price
            reset({
                paint_type: "",
                negotiated_price: Math.round(pricing.target_allowed_price),
            });
        }
    }, [open, pricing, reset]);

    const onSubmit = (data: PaintJobInput) => {
        createJobMutation.mutate({
            income_id: incomeId,
            paint_type: data.paint_type,
            negotiated_price: data.negotiated_price,
        }, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(val);
    };

    // Calculate real-time margin based on base price
    const currentBasePrice = pricing?.base_price ?? 0;
    const currentMinAllowed = pricing?.min_allowed_price ?? 0;
    const currentTargetAllowed = pricing?.target_allowed_price ?? 0;
    
    const isBelowMinimum = negotiatedPrice > 0 && negotiatedPrice < currentMinAllowed;
    const isAboveTarget = negotiatedPrice >= currentTargetAllowed;
    const isWithinNegotiation = negotiatedPrice >= currentMinAllowed && negotiatedPrice < currentTargetAllowed;

    const estimatedMargin = currentBasePrice > 0 
        ? ((negotiatedPrice / currentBasePrice) - 1) * 100 
        : 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1 cursor-pointer">
                        <PaintBucket className="w-4 h-4" />
                        Registrar Trabajo
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-[#0c0c14] border-white/[0.08] text-white max-w-md w-full">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white font-bold">
                        <PaintBucket className="w-5 h-5 text-indigo-400" />
                        Registrar Trabajo de Pintura
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-xs">
                        Registra el acuerdo económico de pintura para este vehículo en taller.
                    </DialogDescription>
                </DialogHeader>

                {isLoadingPricing ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                        <span className="text-xs text-zinc-500">Cargando tarifas de referencia...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                        {/* Reference limits */}
                        {pricing && (
                            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Mínimo Permitido</span>
                                    <strong className="text-red-400 font-bold text-sm block mt-0.5">
                                        {formatCurrency(pricing.min_allowed_price)}
                                    </strong>
                                    <span className="text-[9px] text-zinc-600">Margen: {pricing.min_margin_percent}%</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Precio Recomendado</span>
                                    <strong className="text-indigo-400 font-bold text-sm block mt-0.5">
                                        {formatCurrency(pricing.target_allowed_price)}
                                    </strong>
                                    <span className="text-[9px] text-zinc-600">Margen: {pricing.target_margin_percent}%</span>
                                </div>
                            </div>
                        )}

                        {/* Paint Type */}
                        <div className="space-y-2">
                            <Label htmlFor="paint_type" className="text-zinc-300 text-xs">Tipo de Pintura</Label>
                            <Input
                                id="paint_type"
                                placeholder="Ej: Mate, Metálico, Estándar, Tricapa..."
                                className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 h-9"
                                {...register("paint_type")}
                            />
                            {errors.paint_type && (
                                <p className="text-xs text-red-400">{errors.paint_type.message}</p>
                            )}
                        </div>

                        {/* Negotiated Price */}
                        <div className="space-y-2">
                            <Label htmlFor="negotiated_price" className="text-zinc-300 text-xs">Precio Negociado (COP)</Label>
                            <Input
                                id="negotiated_price"
                                type="number"
                                placeholder="Ej: 350000"
                                className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 h-9"
                                {...register("negotiated_price")}
                            />
                            {errors.negotiated_price && (
                                <p className="text-xs text-red-400">{errors.negotiated_price.message}</p>
                            )}
                        </div>

                        {/* Real-time Indicator Feedback */}
                        {negotiatedPrice > 0 && pricing && (
                            <div className="space-y-2">
                                {isBelowMinimum && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Precio no permitido</p>
                                            <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                                                Precio por debajo del margen mínimo ({pricing.min_margin_percent}%). Mínimo: {formatCurrency(pricing.min_allowed_price)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                {isWithinNegotiation && (
                                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold flex items-center gap-1.5">
                                                Margen aceptado (Negociación)
                                                <Badge className="bg-yellow-500/20 text-yellow-400 border-none font-bold text-[9px] py-0 px-1 font-mono leading-none h-4">
                                                    {estimatedMargin.toFixed(1)}%
                                                </Badge>
                                            </p>
                                            <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                                                El precio está por encima del mínimo, pero por debajo del objetivo del taller.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isAboveTarget && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold flex items-center gap-1.5">
                                                Precio Excelente (Margen Ideal)
                                                <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-bold text-[9px] py-0 px-1 font-mono leading-none h-4">
                                                    {estimatedMargin.toFixed(1)}%
                                                </Badge>
                                            </p>
                                            <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                                                El precio cumple o supera el margen objetivo establecido por el taller.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 h-9 text-xs"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isBelowMinimum || createJobMutation.isPending || !pricing}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 h-9 text-xs font-semibold cursor-pointer"
                            >
                                {createJobMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                        Registrando...
                                    </>
                                ) : (
                                    "Registrar Trabajo"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carSchema, VEHICLE_SIZES, type CarInput } from "@/features/crm/types";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
    onSubmit: (data: CarInput) => void;
    isPending: boolean;
    defaultValues?: Partial<CarInput>;
}

export function CarForm({ onSubmit, isPending, defaultValues }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CarInput>({
        resolver: zodResolver(carSchema),
        defaultValues: {
            license_plate: "",
            brand: "",
            model: "",
            year: new Date().getFullYear(),
            color: "",
            size: "medium",
            ...defaultValues,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Placa */}
            <div className="space-y-2">
                <Label htmlFor="license_plate" className="text-zinc-300">Placa</Label>
                <Input
                    id="license_plate"
                    placeholder="Ej: ABC123"
                    className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 uppercase"
                    {...register("license_plate")}
                />
                {errors.license_plate && <p className="text-xs text-red-400">{errors.license_plate.message}</p>}
            </div>

            {/* Marca y Modelo */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label htmlFor="brand" className="text-zinc-300">Marca</Label>
                    <Input
                        id="brand"
                        placeholder="Ej: Toyota"
                        className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                        {...register("brand")}
                    />
                    {errors.brand && <p className="text-xs text-red-400">{errors.brand.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model" className="text-zinc-300">Modelo</Label>
                    <Input
                        id="model"
                        placeholder="Ej: Corolla"
                        className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                        {...register("model")}
                    />
                    {errors.model && <p className="text-xs text-red-400">{errors.model.message}</p>}
                </div>
            </div>

            {/* Año y Color */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label htmlFor="year" className="text-zinc-300">Año</Label>
                    <Input
                        id="year"
                        type="number"
                        placeholder="2024"
                        className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                        {...register("year")}
                    />
                    {errors.year && <p className="text-xs text-red-400">{errors.year.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="color" className="text-zinc-300">Color</Label>
                    <Input
                        id="color"
                        placeholder="Ej: Blanco"
                        className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                        {...register("color")}
                    />
                    {errors.color && <p className="text-xs text-red-400">{errors.color.message}</p>}
                </div>
            </div>

            {/* Tamaño */}
            <div className="space-y-2">
                <Label className="text-zinc-300">Tamaño del vehículo</Label>
                <Select
                    value={watch("size")}
                    onValueChange={(v) => setValue("size", v as CarInput["size"])}
                >
                    <SelectTrigger className="bg-white/[0.02] border-white/[0.08] text-zinc-200">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0f] border-white/[0.08]">
                        {VEHICLE_SIZES.map((s) => (
                            <SelectItem key={s.value} value={s.value} className="text-zinc-300 focus:bg-white/[0.05]">
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.size && <p className="text-xs text-red-400">{errors.size.message}</p>}
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 mt-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    defaultValues ? "Actualizar vehículo" : "Registrar vehículo"
                )}
            </Button>
        </form>
    );
}

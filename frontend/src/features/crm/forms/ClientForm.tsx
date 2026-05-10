import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, DOCUMENT_TYPES, type ClientInput } from "../types";
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
    onSubmit: (data: ClientInput) => void;
    isPending: boolean;
    defaultValues?: Partial<ClientInput>;
}

export function ClientForm({ onSubmit, isPending, defaultValues }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ClientInput>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            document_type: "cc",
            identity_number: "",
            email: "",
            phone: "",
            ...defaultValues,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">Nombre completo</Label>
                <Input
                    id="name"
                    placeholder="Ej: Juan Pérez"
                    className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                    {...register("name")}
                />
                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>

            {/* Documento (Tipo + Número) */}
            <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2 space-y-2">
                    <Label className="text-zinc-300">Tipo</Label>
                    <Select
                        value={watch("document_type")}
                        onValueChange={(v) => setValue("document_type", v as ClientInput["document_type"])}
                    >
                        <SelectTrigger className="bg-white/[0.02] border-white/[0.08] text-zinc-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a0a0f] border-white/[0.08]">
                            {DOCUMENT_TYPES.map((dt) => (
                                <SelectItem key={dt.value} value={dt.value} className="text-zinc-300 focus:bg-white/[0.05]">
                                    {dt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.document_type && <p className="text-xs text-red-400">{errors.document_type.message}</p>}
                </div>
                <div className="col-span-3 space-y-2">
                    <Label htmlFor="identity_number" className="text-zinc-300">Número</Label>
                    <Input
                        id="identity_number"
                        placeholder="Ej: 1234567890"
                        className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                        {...register("identity_number")}
                    />
                    {errors.identity_number && <p className="text-xs text-red-400">{errors.identity_number.message}</p>}
                </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                    Correo electrónico <span className="text-zinc-500">(opcional)</span>
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                    {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-300">Teléfono</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="Ej: 3101234567"
                    className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                    {...register("phone")}
                />
                {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
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
                    defaultValues ? "Actualizar cliente" : "Registrar cliente"
                )}
            </Button>
        </form>
    );
}

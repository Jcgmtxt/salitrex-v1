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
import { useClients, useClient } from "@/features/crm/hooks/use-clients";
import { useState } from "react";

interface Props {
    onSubmit: (data: CarInput) => void;
    isPending: boolean;
    defaultValues?: Partial<CarInput>;
    isAdmin?: boolean;
}

export function CarForm({ onSubmit, isPending, defaultValues, isAdmin }: Props) {
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

            {/* Cambiar Dueño (Solo Admin) */}
            {isAdmin && defaultValues && (
                <div className="space-y-2 p-3 border border-red-500/30 bg-red-500/5 rounded-lg">
                    <Label htmlFor="client_id" className="text-zinc-300 flex items-center gap-2">
                        ID del Dueño
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                            Admin Only
                        </span>
                    </Label>
                    <p className="text-xs text-zinc-500 mb-2 leading-relaxed">
                        Modificar este ID transferirá el vehículo a otro cliente. Asegúrate de que el nuevo ID de cliente es correcto.
                    </p>
                    <ClientSelector 
                        selectedId={watch("client_id")} 
                        onChange={(id) => setValue("client_id", id, { shouldDirty: true })} 
                    />
                    <input type="hidden" {...register("client_id")} />
                    {errors.client_id && <p className="text-xs text-red-400">{errors.client_id.message}</p>}
                </div>
            )}

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

// Subcomponente para buscar y seleccionar clientes
function ClientSelector({ selectedId, onChange }: { selectedId?: number; onChange: (id: number) => void }) {
    const [search, setSearch] = useState("");
    const { data: searchResults } = useClients({ query: search, limit: 10 });
    const { data: selectedClient } = useClient(selectedId || 0);

    return (
        <div className="space-y-2 relative">
            <div className="text-sm text-zinc-300 bg-white/[0.02] p-2 rounded-md border border-white/[0.04] flex justify-between items-center">
                <span>Dueño seleccionado:</span>
                <strong className="text-indigo-400 truncate max-w-[200px]">
                    {selectedClient ? selectedClient.name : (selectedId || "Ninguno")}
                </strong>
            </div>
            
            <Input 
                placeholder="Buscar cliente por nombre o cédula para transferir..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
            />
            
            {search && searchResults?.items && searchResults.items.length > 0 && (
                <div className="absolute z-10 w-full mt-1 border border-white/[0.08] bg-[#0a0a0f] rounded-md max-h-48 overflow-y-auto shadow-xl shadow-black/50">
                    {searchResults.items.map(client => (
                        <div 
                            key={client.id}
                            className="p-2.5 text-sm text-zinc-200 hover:bg-indigo-500/20 cursor-pointer border-b border-white/[0.04] last:border-0 transition-colors"
                            onClick={() => {
                                onChange(client.id);
                                setSearch(""); // Limpiar búsqueda al seleccionar
                            }}
                        >
                            <div className="font-medium">{client.name}</div>
                            <div className="text-xs text-zinc-500">{client.identity_number}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

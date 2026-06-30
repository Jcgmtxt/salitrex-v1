import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/shared/components/ui/select";
import { useRegisterUser, useUpdateUser } from "../hooks/use-users";
import type { User } from "../types";
import { UserPlus, Edit2, Shield, User as UserIcon, Mail, Lock, Loader2 } from "lucide-react";

interface Props {
    user?: User;
    trigger?: React.ReactNode;
}

export function UserFormDialog({ user, trigger }: Props) {
    const isEdit = !!user;
    const [open, setOpen] = useState(false);
    
    const registerMutation = useRegisterUser();
    const updateMutation = useUpdateUser();

    const userFormSchema = z.object({
        name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
        email: z.string().email("Correo electrónico inválido"),
        password: z.string().optional().or(z.literal("")),
        role: z.enum(["admin", "operator"], {
            message: "Seleccione un rol para el usuario",
        }),
    }).refine((data) => {
        if (!isEdit && (!data.password || data.password.length < 8)) {
            return false;
        }
        if (isEdit && data.password && data.password.length > 0 && data.password.length < 8) {
            return false;
        }
        return true;
    }, {
        message: "La contraseña debe tener al menos 8 caracteres",
        path: ["password"],
    });

    type UserFormInput = z.infer<typeof userFormSchema>;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UserFormInput>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "operator",
        },
    });

    // Reset values on dialog open/close or user change
    useEffect(() => {
        if (open) {
            if (user) {
                reset({
                    name: user.name,
                    email: user.email,
                    password: "",
                    role: user.role,
                });
            } else {
                reset({
                    name: "",
                    email: "",
                    password: "",
                    role: "operator",
                });
            }
        }
    }, [open, user, reset]);

    const onSubmit = (data: UserFormInput) => {
        if (isEdit && user) {
            updateMutation.mutate({
                id: user.id,
                user: {
                    id: user.id,
                    name: data.name,
                    email: data.email,
                    password: data.password || "NO_CHANGE",
                    role: data.role,
                }
            }, {
                onSuccess: () => {
                    setOpen(false);
                }
            });
        } else {
            registerMutation.mutate({
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
            }, {
                onSuccess: () => {
                    setOpen(false);
                }
            });
        }
    };

    const isPending = registerMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 cursor-pointer">
                        <UserPlus className="w-4 h-4" />
                        Nuevo Usuario
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-[#0c0c14] border-white/[0.08] text-white max-w-md w-full">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white font-bold">
                        {isEdit ? (
                            <>
                                <Edit2 className="w-5 h-5 text-indigo-400" />
                                Editar Usuario
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5 text-indigo-400" />
                                Crear Nuevo Usuario
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-xs">
                        {isEdit 
                            ? "Modifique los detalles del operador del taller. Deje la contraseña en blanco si no desea cambiarla."
                            : "Registre una cuenta para un nuevo operador o administrador del taller."
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-300 text-xs">Nombre Completo</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-4 w-4 text-zinc-500" />
                            </div>
                            <Input
                                id="name"
                                placeholder="Ej: Juan Pérez"
                                className="pl-9 bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 h-9"
                                {...register("name")}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-400">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-300 text-xs">Correo Electrónico</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-zinc-500" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="juan@salitrex.com"
                                className="pl-9 bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 h-9"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-400">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-zinc-300 text-xs">
                            Contraseña {isEdit && <span className="text-[10px] text-zinc-500">(Opcional)</span>}
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-zinc-500" />
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder={isEdit ? "Dejar en blanco para mantener la actual" : "Mínimo 8 caracteres"}
                                className="pl-9 bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 h-9"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-400">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label className="text-zinc-300 text-xs">Rol en el Sistema</Label>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="bg-white/[0.02] border-white/[0.08] text-zinc-200 h-9">
                                        <SelectValue placeholder="Seleccione un rol" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0c0c14] border-white/[0.08] text-zinc-200">
                                        <SelectItem value="operator" className="flex items-center gap-2 cursor-pointer focus:bg-white/[0.05] focus:text-white">
                                            <span className="flex items-center gap-1.5">
                                                <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                                                Operador (Acceso estándar)
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="admin" className="flex items-center gap-2 cursor-pointer focus:bg-white/[0.05] focus:text-white">
                                            <span className="flex items-center gap-1.5">
                                                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                                                Administrador (Acceso total)
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.role && (
                            <p className="text-xs text-red-400">{errors.role.message}</p>
                        )}
                    </div>

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
                            disabled={isPending}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 h-9 text-xs font-semibold cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                isEdit ? "Guardar Cambios" : "Crear Usuario"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

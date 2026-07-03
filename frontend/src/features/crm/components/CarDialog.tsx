import { useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { CarForm } from "../forms/CarForm";
import { useCRMMutations } from "../hooks/use-crm-mutations";
import type { CarInput, Car } from "../types";

interface Props {
    clientId: number;
    clientName: string;
    car?: Car;
    children: React.ReactNode;
}

export function CarDialog({ clientId, clientName, car, children }: Props) {
    const [open, setOpen] = useState(false);
    const { createCar, updateCar } = useCRMMutations();
    const role = useAuthStore((state) => state.role);

    const isEdit = !!car;

    const handleSubmit = (data: CarInput) => {
        if (isEdit) {
            // Check if client_id changed
            if (data.client_id && data.client_id !== clientId) {
                const confirmed = window.confirm(
                    "⚠️ ADVERTENCIA: Estás a punto de transferir este vehículo a otro cliente.\n\n¿Estás seguro de que quieres continuar con este cambio?"
                );
                if (!confirmed) return;
            }

            updateCar.mutate(
                { id: car.id, data },
                { onSuccess: () => setOpen(false) },
            );
        } else {
            createCar.mutate(
                { ...data, client_id: clientId },
                { onSuccess: () => setOpen(false) },
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-white/[0.08] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        {isEdit
                            ? `Editando datos del vehículo ${car.license_plate}`
                            : `Registrar un vehículo para ${clientName}.`}
                    </DialogDescription>
                </DialogHeader>
                <CarForm
                    onSubmit={handleSubmit}
                    isPending={createCar.isPending || updateCar.isPending}
                    defaultValues={
                        isEdit
                            ? {
                                ...car,
                                client_id: clientId,
                            }
                            : undefined
                    }
                    isAdmin={role === "admin"}
                />
            </DialogContent>
        </Dialog>
    );
}

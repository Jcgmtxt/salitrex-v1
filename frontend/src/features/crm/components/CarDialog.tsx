import { useState } from "react";
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
import type { CarInput } from "../types";

interface Props {
    clientId: number;
    clientName: string;
    children: React.ReactNode;
}

export function CarDialog({ clientId, clientName, children }: Props) {
    const [open, setOpen] = useState(false);
    const { createCar } = useCRMMutations();

    const handleSubmit = (data: CarInput) => {
        createCar.mutate(
            { ...data, client_id: clientId },
            { onSuccess: () => setOpen(false) },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-white/[0.08] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Nuevo Vehículo</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Registrar un vehículo para {clientName}.
                    </DialogDescription>
                </DialogHeader>
                <CarForm
                    onSubmit={handleSubmit}
                    isPending={createCar.isPending}
                />
            </DialogContent>
        </Dialog>
    );
}

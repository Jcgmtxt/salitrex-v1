import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { ClientForm } from "@/features/crm/forms/ClientForm";
import { useCRMMutations } from "@/features/crm/hooks/use-crm-mutations";
import type { ClientInput } from "@/features/crm/types";

interface Props {
    children: React.ReactNode;
}

// TODO: fix ui to create client

export function ClientDialog({ children }: Props) {
    const [open, setOpen] = useState(false);
    const { createClient } = useCRMMutations();

    const handleSubmit = (data: ClientInput) => {
        createClient.mutate(data, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-white/[0.08] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Nuevo Cliente</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Llena los datos del cliente para registrarlo en el sistema.
                    </DialogDescription>
                </DialogHeader>
                <ClientForm
                    onSubmit={handleSubmit}
                    isPending={createClient.isPending}
                />
            </DialogContent>
        </Dialog>
    );
}

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
import type { Client, ClientInput } from "@/features/crm/types";

interface Props {
    children: React.ReactNode;
    client?: Client;
}

// TODO: fix ui to create client

export function ClientDialog({ children, client }: Props) {
    const [open, setOpen] = useState(false);
    const { createClient, updateClient } = useCRMMutations();

    const handleSubmit = (data: ClientInput) => {
        if (client) {
            updateClient.mutate(
                { id: client.id, data },
                { onSuccess: () => setOpen(false) }
            );
        } else {
            createClient.mutate(data, {
                onSuccess: () => setOpen(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-white/[0.08] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {client ? "Editar Cliente" : "Nuevo Cliente"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        {client 
                            ? "Modifica los datos del cliente." 
                            : "Llena los datos del cliente para registrarlo en el sistema."}
                    </DialogDescription>
                </DialogHeader>
                <ClientForm
                    onSubmit={handleSubmit}
                    isPending={createClient.isPending || updateClient.isPending}
                    defaultValues={client ? {
                        name: client.name,
                        document_type: client.document_type as ClientInput["document_type"],
                        identity_number: client.identity_number,
                        email: client.email || "",
                        phone: client.phone,
                    } : undefined}
                />
            </DialogContent>
        </Dialog>
    );
}

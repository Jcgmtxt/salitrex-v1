import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    activeCategoryLabel: string;
    onUploadClick: () => void;
    isPending: boolean;
}

export function PhotoUploadCard({ activeCategoryLabel, onUploadClick, isPending }: Props) {
    return (
        <div
            onClick={onUploadClick}
            className={cn(
                "relative aspect-video rounded-xl border border-dashed border-white/[0.12] bg-white/[0.01] hover:bg-white/[0.03] flex flex-col items-center justify-center cursor-pointer transition-all hover:border-indigo-500/50 group select-none",
                isPending && "pointer-events-none opacity-60"
            )}
        >
            {isPending ? (
                <>
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mb-2" />
                    <span className="text-[10px] text-zinc-400 font-medium">Subiendo foto...</span>
                </>
            ) : (
                <>
                    <div className="h-8 w-8 rounded-full bg-white/[0.04] group-hover:bg-indigo-500/10 flex items-center justify-center mb-2 transition-colors">
                        <Plus className="h-4 w-4 text-zinc-400 group-hover:text-indigo-400" />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider group-hover:text-zinc-200">
                        Subir a {activeCategoryLabel}
                    </span>
                </>
            )}
        </div>
    );
}

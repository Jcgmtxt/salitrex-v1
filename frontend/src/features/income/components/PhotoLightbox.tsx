import { X } from "lucide-react";
import type { Photo } from "../types";

interface Props {
    photo: Photo | null;
    onClose: () => void;
}

export function PhotoLightbox({ photo, onClose }: Props) {
    if (!photo) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-250"
            onClick={onClose}
        >
            <button
                type="button"
                className="absolute top-4 right-4 h-10 w-10 bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white rounded-full flex items-center justify-center transition-colors border border-white/[0.08]"
                onClick={onClose}
            >
                <X className="h-5 w-5" />
            </button>
            
            <div
                className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-white/[0.08]"
                onClick={(e) => e.stopPropagation()}
            >
                {photo.presigned_url && (
                    <img
                        src={photo.presigned_url}
                        alt={photo.category}
                        className="object-contain w-full h-full max-h-[85vh] select-none"
                    />
                )}
                <div className="absolute bottom-4 left-4 bg-black/75 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-zinc-300 capitalize font-medium">
                    Categoría: {photo.category}
                </div>
            </div>
        </div>
    );
}

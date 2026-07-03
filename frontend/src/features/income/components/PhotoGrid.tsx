import { Camera, ZoomIn, Plus, Loader2 } from "lucide-react";
import type { Photo } from "../types";
import { PhotoUploadCard } from "./PhotoUploadCard";
import { cn } from "@/lib/utils";

interface Props {
    photos: Photo[];
    activeCategoryLabel: string;
    onUploadClick: () => void;
    isPending: boolean;
    onPhotoSelect: (photo: Photo) => void;
}

export function PhotoGrid({
    photos,
    activeCategoryLabel,
    onUploadClick,
    isPending,
    onPhotoSelect,
}: Props) {
    return (
        <div className="space-y-4">
            {/* Desktop view */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Add Photo Card */}
                <PhotoUploadCard
                    activeCategoryLabel={activeCategoryLabel}
                    onUploadClick={onUploadClick}
                    isPending={isPending}
                />

                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950 cursor-pointer shadow-lg hover:shadow-indigo-500/5 transition-all"
                        onClick={() => onPhotoSelect(photo)}
                    >
                        {photo.thumbnail_url || photo.presigned_url ? (
                            <img
                                src={photo.thumbnail_url || photo.presigned_url}
                                alt={photo.category}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600">
                                Error de carga
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="h-6 w-6 text-white" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile view (Horizontal swipe) */}
            <div className="sm:hidden flex gap-3 overflow-x-auto snap-x scrollbar-none pb-2 -mx-4 px-4">
                {/* Add Photo Card Mobile */}
                <div
                    onClick={onUploadClick}
                    className={cn(
                        "snap-center shrink-0 w-[60%] aspect-video rounded-xl border border-dashed border-white/[0.12] bg-white/[0.01] flex flex-col items-center justify-center cursor-pointer transition-all",
                        isPending && "pointer-events-none opacity-60"
                    )}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-400 mb-1.5" />
                            <span className="text-[9px] text-zinc-400">Subiendo...</span>
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4 text-zinc-500 mb-1" />
                            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider text-center px-2">
                                Subir a {activeCategoryLabel}
                            </span>
                        </>
                    )}
                </div>

                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="snap-center shrink-0 w-[80%] aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950 relative"
                        onClick={() => onPhotoSelect(photo)}
                    >
                        {photo.thumbnail_url || photo.presigned_url ? (
                            <img
                                src={photo.thumbnail_url || photo.presigned_url}
                                alt={photo.category}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600">
                                Error de carga
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State when no photos exist (and not uploading) */}
            {photos.length === 0 && !isPending && (
                <div className="rounded-xl border border-dashed border-white/[0.04] p-8 text-center text-zinc-500 flex flex-col items-center justify-center bg-white/[0.005]">
                    <Camera className="h-8 w-8 mb-2 opacity-10 text-indigo-400" />
                    <p className="text-xs">No hay fotografías registradas aún en esta categoría.</p>
                </div>
            )}
        </div>
    );
}

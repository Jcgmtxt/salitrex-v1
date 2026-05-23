import { useState } from "react";
import type { Photo, PhotoCategory } from "../types";
import { Camera, X, ZoomIn } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
    photos: Photo[];
}

const CATEGORIES: { value: PhotoCategory; label: string }[] = [
    { value: "entry", label: "Entrada" },
    { value: "process", label: "Proceso" },
    { value: "finished", label: "Terminado" },
    { value: "exit", label: "Salida" },
];

export function PhotoGallery({ photos }: Props) {
    const [activeTab, setActiveTab] = useState<PhotoCategory>("entry");
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    const filteredPhotos = photos.filter((p) => p.category === activeTab);

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-1.5 border-b border-white/[0.08] pb-px overflow-x-auto snap-x scrollbar-none">
                {CATEGORIES.map((cat) => {
                    const count = photos.filter((p) => p.category === cat.value).length;
                    return (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => setActiveTab(cat.value)}
                            className={cn(
                                "pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-px shrink-0 select-none snap-start flex items-center gap-1.5",
                                activeTab === cat.value
                                    ? "border-indigo-500 text-indigo-400"
                                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            {cat.label}
                            {count > 0 && (
                                <Badge variant="secondary" className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 px-1 py-0 text-[9px] font-bold">
                                    {count}
                                </Badge>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Photos Display (Desktop: Grid, Mobile: Horizontal scroll) */}
            {filteredPhotos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.08] p-12 text-center text-zinc-500 flex flex-col items-center justify-center bg-white/[0.01]">
                    <Camera className="h-10 w-10 mb-3 opacity-20 text-indigo-400" />
                    <p className="text-sm">No hay fotografías registradas en esta categoría.</p>
                </div>
            ) : (
                <div>
                    {/* Grid Desktop, Horizontal Swipe Mobile */}
                    <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredPhotos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950 cursor-pointer shadow-lg hover:shadow-indigo-500/5 transition-all"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                {photo.presigned_url ? (
                                    <img
                                        src={photo.presigned_url}
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

                    {/* Mobile Horizontal scroll snap view */}
                    <div className="sm:hidden flex gap-3 overflow-x-auto snap-x scrollbar-none pb-2 -mx-4 px-4">
                        {filteredPhotos.map((photo) => (
                            <div
                                key={photo.id}
                                className="snap-center shrink-0 w-[80%] aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950 relative"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                {photo.presigned_url ? (
                                    <img
                                        src={photo.presigned_url}
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
                </div>
            )}

            {/* Lightbox / Modal Overlay */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-250"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button
                        type="button"
                        className="absolute top-4 right-4 h-10 w-10 bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white rounded-full flex items-center justify-center transition-colors border border-white/[0.08]"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                    
                    <div
                        className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-white/[0.08]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedPhoto.presigned_url && (
                            <img
                                src={selectedPhoto.presigned_url}
                                alt={selectedPhoto.category}
                                className="object-contain w-full h-full max-h-[85vh] select-none"
                            />
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/75 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-zinc-300 capitalize font-medium">
                            Categoría: {selectedPhoto.category}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

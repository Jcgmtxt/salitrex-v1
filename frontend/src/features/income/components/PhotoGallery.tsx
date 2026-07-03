import { useState, useRef } from "react";
import type { Photo, PhotoCategory } from "../types";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCreateIncomePhoto } from "../hooks/use-incomes";
import { PhotoGrid } from "./PhotoGrid";
import { PhotoLightbox } from "./PhotoLightbox";

interface Props {
    photos: Photo[];
    incomeId: number;
}

const CATEGORIES: { value: PhotoCategory; label: string }[] = [
    { value: "entry", label: "Entrada" },
    { value: "process", label: "Proceso" },
    { value: "finished", label: "Terminado" },
    { value: "exit", label: "Salida" },
];

export function PhotoGallery({ photos, incomeId }: Props) {
    const [activeTab, setActiveTab] = useState<PhotoCategory>("entry");
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadMutation = useCreateIncomePhoto();

    const filteredPhotos = photos.filter((p) => p.category === activeTab);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        uploadMutation.mutate({
            incomeId,
            file,
            category: activeTab,
        }, {
            onSuccess: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        });
    };

    const activeCategoryLabel = CATEGORIES.find(c => c.value === activeTab)?.label || "";

    return (
        <div className="space-y-4">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={uploadMutation.isPending}
            />

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

            {/* Photos Grid */}
            <PhotoGrid
                photos={filteredPhotos}
                activeCategoryLabel={activeCategoryLabel}
                onUploadClick={handleUploadClick}
                isPending={uploadMutation.isPending}
                onPhotoSelect={setSelectedPhoto}
            />

            {/* Lightbox Modal */}
            <PhotoLightbox
                photo={selectedPhoto}
                onClose={() => setSelectedPhoto(null)}
            />
        </div>
    );
}

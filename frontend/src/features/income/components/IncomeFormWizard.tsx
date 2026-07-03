import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateIncome } from "../hooks/use-incomes";
import { CarSelectStep } from "./CarSelectStep";
import type { Car } from "@/features/crm/types";
import type { PhotoCategory } from "../types";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowRight, ArrowLeft, Camera, Trash2, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface PhotoUpload {
    file: File;
    previewUrl: string;
    category: PhotoCategory;
}

export function IncomeFormWizard() {
    const navigate = useNavigate();
    const createMutation = useCreateIncome();

    // Wizard Step State
    const [step, setStep] = useState(1);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [notes, setNotes] = useState("");
    const [agreedExitDate, setAgreedExitDate] = useState("");
    const [photos, setPhotos] = useState<PhotoUpload[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);

        const newPhotos: PhotoUpload[] = selectedFiles.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            category: "entry", // default category for new entry
        }));

        setPhotos((prev) => [...prev, ...newPhotos]);
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => {
            const copy = [...prev];
            URL.revokeObjectURL(copy[index].previewUrl);
            copy.splice(index, 1);
            return copy;
        });
    };

    const handleCategoryChange = (index: number, category: PhotoCategory) => {
        setPhotos((prev) => {
            const copy = [...prev];
            copy[index].category = category;
            return copy;
        });
    };

    const handleNext = () => {
        if (step === 1 && !selectedCar) {
            toast.error("Por favor, selecciona un vehículo.");
            return;
        }
        setStep((prev) => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!selectedCar) return;

        const formData = new FormData();
        formData.append("car_id", String(selectedCar.id));
        if (notes.trim()) formData.append("notes", notes);
        if (agreedExitDate) {
            // Convert local input date string to ISO date string
            const dateObj = new Date(agreedExitDate);
            formData.append("agreed_exit_date_time", dateObj.toISOString());
        }

        photos.forEach((photo) => {
            formData.append("files", photo.file);
            formData.append("categories", photo.category);
        });

        createMutation.mutate(
            {
                formData,
                onProgress: (percent) => setUploadProgress(percent),
            },
            {
                onSuccess: (data) => {
                    navigate({ to: `/income/${data.id}` as any });
                },
            }
        );
    };

    const stepsInfo = [
        { label: "Vehículo", num: 1 },
        { label: "Detalles", num: 2 },
        { label: "Fotografías", num: 3 },
    ];

    const isUploading = createMutation.isPending;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-12">
            {/* Step Indicators */}
            <div className="flex justify-between items-center bg-[#0a0a0f]/60 border border-white/[0.08] backdrop-blur-md rounded-xl p-4">
                {stepsInfo.map((s, idx) => (
                    <div key={s.num} className="flex items-center flex-1 last:flex-initial">
                        <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-semibold text-sm transition-colors ${
                                step >= s.num
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white/[0.04] text-zinc-500 border border-white/[0.06]"
                            }`}>
                                {s.num}
                            </div>
                            <span className={`text-xs font-semibold uppercase tracking-wider hidden sm:inline ${
                                step >= s.num ? "text-zinc-200" : "text-zinc-500"
                            }`}>
                                {s.label}
                            </span>
                        </div>
                        {idx < stepsInfo.length - 1 && (
                            <div className={`flex-1 h-[2px] mx-4 rounded-full transition-colors ${
                                step > s.num ? "bg-indigo-600" : "bg-white/[0.08]"
                            }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Content Container */}
            <Card className="bg-[#0a0a0f]/40 border-white/[0.08] backdrop-blur-md">
                <CardContent className="p-6">
                    {/* Step 1: Car Select */}
                    {step === 1 && (
                        <CarSelectStep
                            selectedCar={selectedCar}
                            onSelectCar={(car) => setSelectedCar(car)}
                        />
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                                    Notas y Observaciones de Ingreso
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Detalla daños en carrocería, rayones, requerimientos específicos del cliente..."
                                    rows={5}
                                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                                    Fecha Estimada de Entrega (Opcional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={agreedExitDate}
                                    onChange={(e) => setAgreedExitDate(e.target.value)}
                                    className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-colors w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Photos */}
                    {step === 3 && (
                        <div className="space-y-6">
                            {/* Upload Area */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.08] hover:border-indigo-500/30 rounded-xl p-8 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={isUploading}
                                />
                                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                                    <Camera className="h-6 w-6 text-indigo-400" />
                                </div>
                                <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                                    Tomar Fotos o Seleccionar Archivos
                                </span>
                                <span className="text-xs text-zinc-500 mt-1">
                                    Soporta subida múltiple e imágenes directas de la cámara
                                </span>
                            </div>

                            {/* Previews Grid */}
                            {photos.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                        Fotos Seleccionadas ({photos.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {photos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-2 rounded-lg border border-white/[0.08] bg-white/[0.02]"
                                            >
                                                <div className="relative h-16 w-24 rounded-md overflow-hidden bg-black border border-white/[0.06] shrink-0">
                                                    <img
                                                        src={photo.previewUrl}
                                                        alt="preview"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <label className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider block mb-1">
                                                        Categoría
                                                    </label>
                                                    <select
                                                        value={photo.category}
                                                        onChange={(e) => handleCategoryChange(index, e.target.value as PhotoCategory)}
                                                        disabled={isUploading}
                                                        className="w-full text-xs rounded border border-white/[0.08] bg-[#0c0c14] p-1 text-zinc-300 focus:outline-none focus:border-indigo-500/50"
                                                    >
                                                        <option value="entry">Entrada (Ingreso)</option>
                                                        <option value="process">Proceso (Pintura/Rep.)</option>
                                                        <option value="finished">Terminado</option>
                                                        <option value="exit">Salida (Entrega)</option>
                                                    </select>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isUploading}
                                                    onClick={() => removePhoto(index)}
                                                    className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Progress Bar */}
                            {isUploading && (
                                <div className="space-y-2 border-t border-white/[0.06] pt-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-indigo-400 font-semibold flex items-center gap-1.5 animate-pulse">
                                            <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Subiendo fotografías...
                                        </span>
                                        <span className="text-zinc-400 font-semibold">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-white/[0.05] h-2 rounded-full overflow-hidden border border-white/[0.04]">
                                        <div
                                            className="bg-indigo-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 1 || isUploading}
                    className="text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Atrás
                </Button>

                {step < 3 ? (
                    <Button
                        onClick={handleNext}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    >
                        Siguiente
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={isUploading || !selectedCar}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    >
                        Registrar Entrada
                        <CheckCircle2 className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}

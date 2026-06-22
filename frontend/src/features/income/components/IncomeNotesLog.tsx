import { useState } from "react";
import { useCreateIncomeNote } from "../hooks/use-incomes";
import type { IncomeNote } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";

interface Props {
    incomeId: number;
    notesLog?: IncomeNote[];
    formatDate: (dateStr?: string | null) => string;
}

export function IncomeNotesLog({ incomeId, notesLog, formatDate }: Props) {
    const createNoteMutation = useCreateIncomeNote();
    const [newNote, setNewNote] = useState("");

    const handleAddNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || createNoteMutation.isPending) return;

        createNoteMutation.mutate(
            { incomeId, note: newNote.trim() },
            {
                onSuccess: () => {
                    setNewNote("");
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleAddNoteSubmit(e);
        }
    };

    // Sort notes newest first for the timeline view
    const sortedNotes = notesLog
        ? [...notesLog].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        : [];

    return (
        <Card className="bg-[#0a0a0f]/50 border-white/[0.08] backdrop-blur-md">
            <CardHeader className="border-b border-white/[0.04] pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2 font-bold">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    Bitácora del Ingreso
                </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-6">
                {/* Form to add note */}
                <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe una actualización o nota en la bitácora... (Ctrl+Enter para guardar)"
                            className="bg-white/[0.01] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 min-h-[80px] text-sm focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={!newNote.trim() || createNoteMutation.isPending}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs px-4 h-8 font-semibold shadow-lg shadow-indigo-500/10"
                        >
                            {createNoteMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Agregar Nota"
                            )}
                        </Button>
                    </div>
                </form>

                {/* Timeline Notes List */}
                {sortedNotes.length > 0 ? (
                    <div className="relative border-l border-white/[0.06] ml-2.5 pl-6 space-y-6 mt-4">
                        {sortedNotes.map((note) => (
                            <div key={note.id} className="relative group">
                                {/* Bullet Point */}
                                <span className="absolute -left-[31px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-zinc-800 border border-zinc-500/30 group-hover:border-indigo-500/60 group-hover:bg-indigo-600 transition-colors" />
                                
                                {/* Note Info */}
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="font-semibold text-zinc-300">
                                            {note.creator_name || "Operador"}
                                        </span>
                                        <span className="text-[10px] text-zinc-500">
                                            {formatDate(note.created_at)}
                                        </span>
                                    </div>
                                    <div className="bg-white/[0.015] border border-white/[0.04] group-hover:border-white/[0.08] rounded-xl p-3.5 text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed shadow-sm transition-all">
                                        {note.note}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-zinc-500 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.005]">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-10 text-indigo-400" />
                        <p className="text-xs">No hay notas registradas en esta bitácora todavía.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

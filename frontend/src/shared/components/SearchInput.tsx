import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

export function SearchInput({ value, onChange, placeholder = "Buscar...", debounceMs = 300, className, onFocus, onBlur }: Props) {
    const [localValue, setLocalValue] = useState(value);

    // Sync external value changes (e.g., browser back button)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounce: solo propaga el cambio después de que el usuario deja de escribir
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);

        return () => clearTimeout(timeout);
    }, [localValue, debounceMs, onChange, value]);

    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
                className="pl-9 pr-9 bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-indigo-500/40"
            />
            {localValue && (
                <button
                    onClick={() => {
                        setLocalValue("");
                        onChange("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

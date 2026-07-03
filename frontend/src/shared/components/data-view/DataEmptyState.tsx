import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isSearch?: boolean;
  searchQuery?: string;
}

export function DataEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  isSearch,
  searchQuery,
}: Props) {
  if (isSearch && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-white/[0.08] rounded-xl bg-white/[0.02]">
        <p className="text-zinc-400 text-sm">
          No se encontraron resultados para "<span className="text-white font-medium">{searchQuery}</span>"
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/[0.08] rounded-xl bg-white/[0.02]">
      <div className="bg-indigo-500/10 p-4 rounded-full mb-4">
        <Icon className="h-8 w-8 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

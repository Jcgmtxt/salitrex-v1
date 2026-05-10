import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface Props {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isPlaceholderData?: boolean;
}

export function DataPagination({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
  isPlaceholderData = false,
}: Props) {
  if (totalPages <= 1 && currentPage === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 mt-4">
      <div className="flex items-center gap-2">
        <p className="text-xs text-zinc-500 font-medium">Items por página</p>
        <Select
          value={limit.toString()}
          onValueChange={(v) => onLimitChange(Number(v))}
        >
          <SelectTrigger className="h-8 w-[70px] bg-white/[0.02] border-white/[0.08] text-zinc-300 text-xs">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0f] border-white/[0.08]">
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()} className="text-zinc-300 text-xs focus:bg-white/[0.05]">
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-xs text-zinc-500">
          Página {currentPage + 1} de {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 0}
            onClick={() => onPageChange(0)}
            className="h-8 w-8 border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 w-8 border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages - 1 || isPlaceholderData}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 w-8 border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages - 1 || isPlaceholderData}
            onClick={() => onPageChange(totalPages - 1)}
            className="h-8 w-8 border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

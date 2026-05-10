import React from "react";
import { SearchInput } from "@/shared/components/SearchInput";
import { DataPagination } from "./DataPagination";
import { DataEmptyState } from "./DataEmptyState";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface DataLayoutProps<T> {
  // Datos
  data: T[];
  total: number;
  isLoading: boolean;
  isPlaceholderData: boolean;
  error: Error | null;

  // Parámetros
  params: { query?: string; offset?: number; limit?: number };
  setQuery: (q: string) => void;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  currentPage: number;

  // Configuración UI
  searchPlaceholder?: string;
  emptyState: {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  };

  // Renderers (para desktop y mobile)
  children: React.ReactNode;
}

export function DataLayout<T>({
  data,
  total,
  isLoading,
  isPlaceholderData,
  error,
  params,
  setQuery,
  setPage,
  setLimit,
  currentPage,
  searchPlaceholder = "Buscar...",
  emptyState,
  children,
}: DataLayoutProps<T>) {
  const limit = params.limit || 20;
  const totalPages = Math.ceil(total / limit);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-red-400">
        <p>Error al cargar: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={params.query || ""}
          onChange={setQuery}
          placeholder={searchPlaceholder}
          className="flex-1 max-w-sm"
        />
        {total > 0 && (
          <span className="text-xs text-zinc-500 hidden sm:inline">
            {total} resultado{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoading ? (
        <DataSkeleton />
      ) : data.length === 0 ? (
        <DataEmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          actionLabel={emptyState.actionLabel}
          onAction={emptyState.onAction}
          isSearch={!!params.query}
          searchQuery={params.query}
        />
      ) : (
        <>
          <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {children}
          </div>

          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            isPlaceholderData={isPlaceholderData}
          />
        </>
      )}
    </div>
  );
}

function DataSkeleton() {
  return (
    <div className="space-y-4">
      <div className="hidden md:block rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:hidden">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl bg-white/[0.05]" />
        ))}
      </div>
    </div>
  );
}

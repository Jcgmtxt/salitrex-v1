import { useCallback, useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { ListQueryParams } from "@/shared/types/pagination";

export function useListParams() {
    const navigate = useNavigate();
    const searchParams = useSearch({ strict: false }) as Record<string, unknown>;

    const params: ListQueryParams = useMemo(() => ({
        query: (searchParams.query as string) || undefined,
        offset: Number(searchParams.offset) || 0,
        limit: Number(searchParams.limit) || 20,
    }), [searchParams.query, searchParams.offset, searchParams.limit]);

    const setParams = useCallback(
        (updates: Partial<ListQueryParams>) => {
            const merged = { ...params, ...updates };

            if (updates.query !== undefined && updates.query !== params.query) {
                merged.offset = 0;
            }
            const search: Record<string, string | number> = {};
            if (merged.query) search.query = merged.query;
            if (merged.offset && merged.offset > 0) search.offset = merged.offset;
            if (merged.limit && merged.limit !== 20) search.limit = merged.limit;

            navigate({
                search: search as any,
                replace: true,
            });
        },
        [navigate, params],
    );

    const setQuery = useCallback(
        (query: string) => setParams({ query: query || undefined }),
        [setParams],
    );

    const setPage = useCallback(
        (page: number) => setParams({ offset: page * (params.limit || 20) }),
        [setParams, params.limit],
    );

    const setLimit = useCallback(
        (limit: number) => setParams({ limit, offset: 0 }),
        [setParams],
    );

    const currentPage = Math.floor((params.offset || 0) / (params.limit || 20));

    return {
        params,
        setParams,
        setQuery,
        setPage,
        setLimit,
        currentPage,
    };
}

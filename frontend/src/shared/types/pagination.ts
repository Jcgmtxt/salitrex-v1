export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    offset: number;
    limit: number;
}

export interface ListQueryParams {
    query?: string;
    offset?: number;
    limit?: number;
}

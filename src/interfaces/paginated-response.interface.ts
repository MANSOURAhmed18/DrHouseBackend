// src/interfaces/paginated-response.interface.ts
export interface PaginatedResponse<T> {
    data: Partial<T>[];  // Change this line to allow partial user objects
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
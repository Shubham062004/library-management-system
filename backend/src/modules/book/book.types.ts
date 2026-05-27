/**
 * Input format when registering a new book record
 */
export interface CreateBookInput {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  availableQuantity: number;
}

/**
 * Input format when updating an existing book record
 */
export interface UpdateBookInput {
  title?: string;
  author?: string;
  isbn?: string;
  quantity?: number;
  availableQuantity?: number;
}

/**
 * Supported request queries for listing books
 */
export interface BookQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  available?: string;
  lowStock?: string;
}

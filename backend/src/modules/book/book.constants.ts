/**
 * Default pagination parameters for book queries
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

/**
 * Sorting configuration and allowed fields for book queries
 */
export const ALLOWED_SORT_FIELDS = [
  'title',
  'author',
  'isbn',
  'quantity',
  'availableQuantity',
  'createdAt'
];
export const DEFAULT_SORT_BY = 'createdAt';
export const DEFAULT_SORT_ORDER = 'desc';

/**
 * Inventory configuration
 */
export const LOW_STOCK_THRESHOLD = 2;

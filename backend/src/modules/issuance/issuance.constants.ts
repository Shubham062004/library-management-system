/**
 * Default pagination parameters for issuances
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

/**
 * Sorting configuration and allowed fields for issuances
 */
export const ALLOWED_SORT_FIELDS = [
  'issueDate',
  'targetReturnDate',
  'actualReturnDate',
  'status',
  'createdAt',
  'updatedAt'
];
export const DEFAULT_SORT_BY = 'createdAt';
export const DEFAULT_SORT_ORDER = 'desc';

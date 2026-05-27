/**
 * Input format when issuing a book
 */
export interface IssueBookInput {
  memberId: string;
  bookId: string;
  targetReturnDate: Date;
}

/**
 * Supported request queries for listing issuances
 */
export interface IssuanceQueryFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: 'ISSUED' | 'RETURNED';
  memberId?: string;
  bookId?: string;
}

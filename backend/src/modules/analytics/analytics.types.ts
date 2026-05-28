/**
 * Return structure for books never borrowed
 */
export interface NeverBorrowedBookResult {
  bookTitle: string;
  author: string;
}

/**
 * Return structure for outstanding borrowed books
 */
export interface OutstandingBookResult {
  memberName: string;
  bookTitle: string;
  issueDate: Date;
  targetReturnDate: Date;
  author: string;
}

/**
 * Return structure for top borrowed books listing
 */
export interface TopBorrowedBookResult {
  bookTitle: string;
  borrowCount: number;
  uniqueMembers: number;
}

/**
 * Return structure for system-wide statistics summary
 */
export interface SystemStatsResult {
  totalBooks: number;
  totalMembers: number;
  activeIssuances: number;
  overdueBooks: number;
}

/**
 * Return structure for member overdue summaries
 */
export interface OverdueSummaryResult {
  memberName: string;
  email: string;
  overdueCount: number;
  books: {
    bookTitle: string;
    issueDate: Date;
    targetReturnDate: Date;
    overdueDays: number;
  }[];
}

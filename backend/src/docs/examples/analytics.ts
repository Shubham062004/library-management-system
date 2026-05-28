/**
 * @openapi
 * components:
 *   examples:
 *     SystemStatsExample:
 *       summary: Combined library activity summary stats
 *       value:
 *         success: true
 *         message: System stats compiled successfully
 *         data:
 *           totalBooks: 120
 *           totalMembers: 45
 *           activeIssuances: 15
 *           overdueBooks: 3
 * 
 *     TopBorrowedBooksExample:
 *       summary: Top 10 borrowings ranking
 *       value:
 *         success: true
 *         message: Top borrowed books fetched successfully
 *         data:
 *           - bookTitle: "The Clean Coder"
 *             borrowCount: 42
 *             uniqueMembers: 18
 *           - bookTitle: "Clean Architecture"
 *             borrowCount: 30
 *             uniqueMembers: 12
 */
export const analyticsExamplesPlaceholder = true;

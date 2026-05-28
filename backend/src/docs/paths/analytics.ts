/**
 * @openapi
 * /analytics/books/never-borrowed:
 *   get:
 *     summary: Books Never Borrowed Report
 *     description: Executes raw SQL join auditing to find book records that have never been issued to any member. Protected by JWT.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report compiled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NeverBorrowedResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 * /analytics/books/outstanding:
 *   get:
 *     summary: Active Outstanding Borrowings Report
 *     description: Executes raw SQL join auditing to find active unreturned borrow transactions with full catalog data. Protected by JWT.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report compiled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsOutstandingResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 * /analytics/books/top-borrowed:
 *   get:
 *     summary: Top 10 Most Borrowed Books Ranking
 *     description: Compiles top 10 borrowed book items including total borrow counts and unique member counts. Protected by JWT.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report compiled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopBorrowedResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 * /analytics/stats:
 *   get:
 *     summary: System Overview Statistics
 *     description: Retrieve total books count, members count, active outstanding borrows, and active overdue borrows. Protected by JWT.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SystemStatsResponse'
 *             examples:
 *               overview:
 *                 $ref: '#/components/examples/SystemStatsExample'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 * /analytics/overdue-summary:
 *   get:
 *     summary: Active Borrowings Exceeding Return Deadlines Grouped by Member
 *     description: Executes raw SQL grouping to find total overdue items counts categorized by member. Protected by JWT.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report compiled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OverdueSummaryResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
export const analyticsPathsPlaceholder = true;

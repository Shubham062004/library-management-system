/**
 * @openapi
 * components:
 *   schemas:
 *     NeverBorrowedBookResult:
 *       type: object
 *       required:
 *         - bookTitle
 *         - author
 *       properties:
 *         bookTitle:
 *           type: string
 *           example: "The Clean Coder"
 *         author:
 *           type: string
 *           example: "Robert C. Martin"
 * 
 *     NeverBorrowedResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Books never borrowed fetched successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NeverBorrowedBookResult'
 * 
 *     AnalyticsOutstandingBookResult:
 *       type: object
 *       required:
 *         - memberName
 *         - bookTitle
 *         - issueDate
 *         - targetReturnDate
 *         - author
 *       properties:
 *         memberName:
 *           type: string
 *           example: "Rahul Sharma"
 *         bookTitle:
 *           type: string
 *           example: "The Clean Coder"
 *         issueDate:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T11:06:06.000Z
 *         targetReturnDate:
 *           type: string
 *           format: date-time
 *           example: 2026-06-11T11:06:06.000Z
 *         author:
 *           type: string
 *           example: "Robert C. Martin"
 * 
 *     AnalyticsOutstandingResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Outstanding issuances retrieved successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnalyticsOutstandingBookResult'
 * 
 *     TopBorrowedBookResult:
 *       type: object
 *       required:
 *         - bookTitle
 *         - borrowCount
 *         - uniqueMembers
 *       properties:
 *         bookTitle:
 *           type: string
 *           example: "The Clean Coder"
 *         borrowCount:
 *           type: integer
 *           example: 42
 *         uniqueMembers:
 *           type: integer
 *           example: 18
 * 
 *     TopBorrowedResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Top borrowed books fetched successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TopBorrowedBookResult'
 * 
 *     SystemStats:
 *       type: object
 *       required:
 *         - totalBooks
 *         - totalMembers
 *         - activeIssuances
 *         - overdueBooks
 *       properties:
 *         totalBooks:
 *           type: integer
 *           example: 120
 *         totalMembers:
 *           type: integer
 *           example: 45
 *         activeIssuances:
 *           type: integer
 *           example: 15
 *         overdueBooks:
 *           type: integer
 *           example: 3
 * 
 *     SystemStatsResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: System stats compiled successfully
 *         data:
 *           $ref: '#/components/schemas/SystemStats'
 * 
 *     OverdueSummaryResult:
 *       type: object
 *       required:
 *         - memberName
 *         - overdueCount
 *       properties:
 *         memberName:
 *           type: string
 *           example: "Rahul Sharma"
 *         overdueCount:
 *           type: integer
 *           example: 2
 * 
 *     OverdueSummaryResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Overdue summaries compiled successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OverdueSummaryResult'
 */
export const analyticsSchemasPlaceholder = true;

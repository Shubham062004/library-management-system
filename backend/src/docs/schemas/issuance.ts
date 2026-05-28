/**
 * @openapi
 * components:
 *   schemas:
 *     Issuance:
 *       type: object
 *       required:
 *         - id
 *         - bookId
 *         - memberId
 *         - issueDate
 *         - targetReturnDate
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: f1e2d3c4-b5a6-9876-5432-10fedcba9876
 *         bookId:
 *           type: string
 *           format: uuid
 *           example: a8b8c8d8-e8f8-4a4b-8c8d-8e8f8a8b8c8d
 *         memberId:
 *           type: string
 *           format: uuid
 *           example: bdf5e6e2-2db3-4318-9774-727ad40bcf8d
 *         issueDate:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T11:06:06.000Z
 *         targetReturnDate:
 *           type: string
 *           format: date-time
 *           example: 2026-06-11T11:06:06.000Z
 *         actualReturnDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         status:
 *           type: string
 *           enum: [ISSUED, RETURNED]
 *           example: ISSUED
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T11:06:06.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T11:06:06.000Z
 * 
 *     IssueBookInput:
 *       type: object
 *       required:
 *         - bookId
 *         - memberId
 *       properties:
 *         bookId:
 *           type: string
 *           format: uuid
 *           description: UUID of the book catalog item being borrowed
 *           example: a8b8c8d8-e8f8-4a4b-8c8d-8e8f8a8b8c8d
 *         memberId:
 *           type: string
 *           format: uuid
 *           description: UUID of the library member borrowing the item
 *           example: bdf5e6e2-2db3-4318-9774-727ad40bcf8d
 * 
 *     IssuanceResponse:
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
 *           example: Book issued successfully
 *         data:
 *           $ref: '#/components/schemas/Issuance'
 * 
 *     OutstandingIssuance:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/Issuance'
 *         - type: object
 *           required:
 *             - book
 *             - member
 *           properties:
 *             book:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "The Clean Coder"
 *                 author:
 *                   type: string
 *                   example: "Robert C. Martin"
 *             member:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Rahul Sharma"
 *                 email:
 *                   type: string
 *                   example: "rahul@example.com"
 * 
 *     OverdueIssuance:
 *       type: object
 *       required:
 *         - id
 *         - book
 *         - member
 *         - targetReturnDate
 *         - overdueDays
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: c5d4e3f2-a1b2-3c4d-5e6f-7a8b9c0d1e2f
 *         targetReturnDate:
 *           type: string
 *           format: date-time
 *           example: 2026-05-14T11:06:06.000Z
 *         overdueDays:
 *           type: integer
 *           example: 14
 *         book:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "The Clean Coder"
 *             author:
 *               type: string
 *               example: "Robert C. Martin"
 *         member:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Rahul Sharma"
 *             email:
 *               type: string
 *               example: "rahul@example.com"
 * 
 *     OutstandingIssuanceListResponse:
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
 *           example: Outstanding issuances fetched successfully
 *         data:
 *           type: object
 *           required:
 *             - issuances
 *           properties:
 *             issuances:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OutstandingIssuance'
 * 
 *     OverdueIssuanceListResponse:
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
 *           example: Overdue issuances fetched successfully
 *         data:
 *           type: object
 *           required:
 *             - issuances
 *           properties:
 *             issuances:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OverdueIssuance'
 * 
 *     IssuanceListData:
 *       type: object
 *       required:
 *         - issuances
 *         - pagination
 *       properties:
 *         issuances:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Issuance'
 *         pagination:
 *           type: object
 *           required:
 *             - total
 *             - page
 *             - limit
 *             - pages
 *           properties:
 *             total:
 *               type: integer
 *               example: 10
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             pages:
 *               type: integer
 *               example: 1
 * 
 *     IssuanceListResponse:
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
 *           example: Issuances fetched successfully
 *         data:
 *           $ref: '#/components/schemas/IssuanceListData'
 */
export const issuanceSchemasPlaceholder = true;

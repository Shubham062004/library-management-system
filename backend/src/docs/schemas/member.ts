/**
 * @openapi
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - phone
 *         - membershipDate
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: bdf5e6e2-2db3-4318-9774-727ad40bcf8d
 *         name:
 *           type: string
 *           example: Rahul Sharma
 *         email:
 *           type: string
 *           format: email
 *           example: rahul@example.com
 *         phone:
 *           type: string
 *           example: "9876543210"
 *         membershipDate:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T00:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T11:06:06.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T11:06:06.000Z
 * 
 *     CreateMemberInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the library cardholder
 *           example: Rahul Sharma
 *         email:
 *           type: string
 *           format: email
 *           description: Unique email address of the cardholder
 *           example: rahul@example.com
 *         phone:
 *           type: string
 *           description: Ten-digit contact number
 *           example: "9876543210"
 * 
 *     UpdateMemberInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Rahul K. Sharma
 *         email:
 *           type: string
 *           format: email
 *           example: rahul.sharma@example.com
 *         phone:
 *           type: string
 *           example: "9876543211"
 * 
 *     MemberResponse:
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
 *           example: Member processed successfully
 *         data:
 *           $ref: '#/components/schemas/Member'
 * 
 *     MemberListData:
 *       type: object
 *       required:
 *         - members
 *         - pagination
 *       properties:
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Member'
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
 *               example: 25
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             pages:
 *               type: integer
 *               example: 3
 * 
 *     MemberListResponse:
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
 *           example: Members fetched successfully
 *         data:
 *           $ref: '#/components/schemas/MemberListData'
 */
export const memberSchemasPlaceholder = true;

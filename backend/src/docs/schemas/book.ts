/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - author
 *         - isbn
 *         - quantity
 *         - availableQuantity
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: a8b8c8d8-e8f8-4a4b-8c8d-8e8f8a8b8c8d
 *         title:
 *           type: string
 *           example: "The Clean Coder"
 *         author:
 *           type: string
 *           example: "Robert C. Martin"
 *         isbn:
 *           type: string
 *           example: "9780137081073"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           example: 5
 *         availableQuantity:
 *           type: integer
 *           minimum: 0
 *           example: 4
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T11:06:06.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T11:06:06.000Z
 * 
 *     CreateBookInput:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - isbn
 *         - quantity
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the catalog item
 *           example: "The Clean Coder"
 *         author:
 *           type: string
 *           description: The author who penned the book
 *           example: "Robert C. Martin"
 *         isbn:
 *           type: string
 *           description: Unique 10 or 13 character International Standard Book Number
 *           example: "9780137081073"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           description: Total quantity purchased into library catalog
 *           example: 5
 * 
 *     UpdateBookInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "The Clean Coder (Revised Edition)"
 *         author:
 *           type: string
 *           example: "Robert C. Martin"
 *         isbn:
 *           type: string
 *           example: "9780137081073"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           example: 8
 * 
 *     BookResponse:
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
 *           example: Book processed successfully
 *         data:
 *           $ref: '#/components/schemas/Book'
 * 
 *     BookListData:
 *       type: object
 *       required:
 *         - books
 *         - pagination
 *       properties:
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
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
 *               example: 100
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             pages:
 *               type: integer
 *               example: 10
 * 
 *     BookListResponse:
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
 *           example: Books fetched successfully
 *         data:
 *           $ref: '#/components/schemas/BookListData'
 */
export const bookSchemasPlaceholder = true;

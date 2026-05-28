/**
 * @openapi
 * components:
 *   examples:
 *     CreateBookRequestExample:
 *       summary: Basic Book Creation Payload
 *       value:
 *         title: "The Clean Coder"
 *         author: "Robert C. Martin"
 *         isbn: "9780137081073"
 *         quantity: 5
 * 
 *     BookResponseExample:
 *       summary: Singular Book Detail Response Envelope
 *       value:
 *         success: true
 *         message: Book processed successfully
 *         data:
 *           id: a8b8c8d8-e8f8-4a4b-8c8d-8e8f8a8b8c8d
 *           title: "The Clean Coder"
 *           author: "Robert C. Martin"
 *           isbn: "9780137081073"
 *           quantity: 5
 *           availableQuantity: 4
 *           createdAt: 2026-05-28T11:06:06.000Z
 *           updatedAt: 2026-05-28T11:06:06.000Z
 */
export const bookExamplesPlaceholder = true;

/**
 * @openapi
 * /issuances:
 *   post:
 *     summary: Issue a book to a member
 *     description: Creates an active borrow transaction. Automatically decrements available book quantity by 1. Protected by JWT.
 *     tags:
 *       - Issuances
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IssueBookInput'
 *           examples:
 *             newIssuance:
 *               $ref: '#/components/examples/IssueBookRequestExample'
 *     responses:
 *       201:
 *         description: Book issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssuanceResponse'
 *       400:
 *         description: Validation schema error or inventory constraint violation (e.g. member borrowing limits exceeded, book out of stock)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 *   get:
 *     summary: Retrieve issuance records list
 *     description: Returns a paginated list of borrow transactions. Protected by JWT.
 *     tags:
 *       - Issuances
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Issuances fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssuanceListResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 * /issuances/outstanding:
 *   get:
 *     summary: Retrieve active outstanding checkouts
 *     description: Returns outstanding borrowings (unreturned items) including detailed parent member and book shapes. Protected by JWT.
 *     tags:
 *       - Issuances
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outstanding checkouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutstandingIssuanceListResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 * /issuances/overdue:
 *   get:
 *     summary: Retrieve overdue borrowed items
 *     description: Returns active checkouts exceeding target return deadlines without actual returns, listing elapsed late days. Protected by JWT.
 *     tags:
 *       - Issuances
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue checkouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OverdueIssuanceListResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 * /issuances/{id}:
 *   get:
 *     summary: Retrieve issuance record by UUID
 *     description: Returns detailed single borrow transaction info. Protected by JWT.
 *     tags:
 *       - Issuances
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique issuance record UUID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Issuance record fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssuanceResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Issuance UUID not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 * 
 * /issuances/{id}/return:
 *   put:
 *     summary: Return a borrowed book
 *     description: Processes a return checkout. Updates actual return date, sets status to RETURNED, and increments available book quantity by 1. Protected by JWT.
 *     tags:
 *       - Issuances
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique issuance UUID to return
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Book returned and inventory restored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssuanceResponse'
 *       400:
 *         description: Return validation or business state conflict errors (e.g. item already returned)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Issuance UUID not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
export const issuancePathsPlaceholder = true;

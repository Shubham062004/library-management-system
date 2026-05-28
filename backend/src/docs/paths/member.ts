/**
 * @openapi
 * /members:
 *   post:
 *     summary: Register a new library member
 *     description: Creates a new library cardholder record with a membership date. Protected by JWT.
 *     tags:
 *       - Members
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMemberInput'
 *           examples:
 *             newMember:
 *               $ref: '#/components/examples/CreateMemberRequestExample'
 *     responses:
 *       201:
 *         description: Member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberResponse'
 *       400:
 *         description: Schema validation mismatch errors
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
 *       409:
 *         description: Member with matching email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 * 
 *   get:
 *     summary: Retrieve library members catalog
 *     description: Returns a list of members with search, pagination, and sorting. Protected by JWT.
 *     tags:
 *       - Members
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         required: false
 *         description: Term matching member name or email address
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number to load
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: Field name to sort by
 *         schema:
 *           type: string
 *           enum: [name, email, membershipDate, createdAt]
 *           default: createdAt
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         description: Sort order direction
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberListResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 * 
 * /members/{id}:
 *   get:
 *     summary: Retrieve member by UUID
 *     description: Returns single member details. Protected by JWT.
 *     tags:
 *       - Members
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique member UUID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Member found and fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberResponse'
 *       401:
 *         description: Bearer JWT credentials missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Member record UUID not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 * 
 *   put:
 *     summary: Update member record details
 *     description: Edits fields of an existing member profile. Protected by JWT.
 *     tags:
 *       - Members
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique member UUID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMemberInput'
 *     responses:
 *       200:
 *         description: Member record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberResponse'
 *       400:
 *         description: Schema validation mismatch errors
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
 *         description: Member record UUID not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Email conflict. Already assigned to another member.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 */
export const memberPathsPlaceholder = true;

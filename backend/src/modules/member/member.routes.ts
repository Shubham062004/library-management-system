import { Router } from 'express';
import { createMember, getMembers, getMemberById, updateMember } from './member.controller';
import { createMemberSchema, updateMemberSchema } from './member.validation';
import { validateRequest } from '../../validators/authValidator';
import { authenticate } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Shield all member routes with JWT validation
router.use(authenticate);

/**
 * @route   POST /members
 * @desc    Create a new library member
 * @access  Private
 */
router.post(
  '/',
  validateRequest(createMemberSchema),
  asyncHandler(createMember)
);

/**
 * @route   GET /members
 * @desc    Retrieve all library members with search, pagination, and sorting filters
 * @access  Private
 */
router.get(
  '/',
  asyncHandler(getMembers)
);

/**
 * @route   GET /members/:id
 * @desc    Retrieve details of a single member by their UUID
 * @access  Private
 */
router.get(
  '/:id',
  asyncHandler(getMemberById)
);

/**
 * @route   PUT /members/:id
 * @desc    Update credentials of a member
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest(updateMemberSchema),
  asyncHandler(updateMember)
);

export default router;

import { Router } from 'express';
import {
  issueBook,
  getIssuances,
  getIssuanceById,
  returnBook,
  getOutstandingIssuances,
  getOverdueIssuances,
} from './issuance.controller';
import { issueBookSchema } from './issuance.validation';
import { validateRequest } from '../../validators/authValidator';
import { authenticate } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Enforce Bearer JWT verification on all issuance routes
router.use(authenticate);

/**
 * @route   POST /issuances
 * @desc    Issue a library book to a member
 * @access  Private
 */
router.post(
  '/',
  validateRequest(issueBookSchema),
  asyncHandler(issueBook)
);

/**
 * @route   GET /issuances
 * @desc    Retrieve list of issuance records with query variables
 * @access  Private
 */
router.get(
  '/',
  asyncHandler(getIssuances)
);

/**
 * @route   GET /issuances/outstanding
 * @desc    Retrieve list of active unreturned borrow transactions
 * @access  Private
 */
router.get(
  '/outstanding',
  asyncHandler(getOutstandingIssuances)
);

/**
 * @route   GET /issuances/overdue
 * @desc    Retrieve active borrowed items exceeding their return deadline
 * @access  Private
 */
router.get(
  '/overdue',
  asyncHandler(getOverdueIssuances)
);

/**
 * @route   GET /issuances/:id
 * @desc    Retrieve detailed info of a single borrow record by UUID
 * @access  Private
 */
router.get(
  '/:id',
  asyncHandler(getIssuanceById)
);

/**
 * @route   PUT /issuances/:id/return
 * @desc    Return a borrowed library book and restore inventory stock
 * @access  Private
 */
router.put(
  '/:id/return',
  asyncHandler(returnBook)
);

export default router;

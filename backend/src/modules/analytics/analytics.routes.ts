import { Router } from 'express';
import {
  getNeverBorrowedBooks,
  getOutstandingBooks,
  getTopBorrowedBooks,
  getSystemStats,
  getOverdueSummary,
} from './analytics.controller';
import { authenticate } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Shield all analytics and reporting resources under JWT authentication
router.use(authenticate);

/**
 * @route   GET /analytics/books/never-borrowed
 * @desc    Retrieve list of library books that have never been issued
 * @access  Private
 */
router.get(
  '/books/never-borrowed',
  asyncHandler(getNeverBorrowedBooks)
);

/**
 * @route   GET /analytics/books/outstanding
 * @desc    Retrieve active outstanding borrowed items with parent details
 * @access  Private
 */
router.get(
  '/books/outstanding',
  asyncHandler(getOutstandingBooks)
);

/**
 * @route   GET /analytics/books/top-borrowed
 * @desc    Retrieve top 10 most borrowed books with aggregate statistics
 * @access  Private
 */
router.get(
  '/books/top-borrowed',
  asyncHandler(getTopBorrowedBooks)
);

/**
 * @route   GET /analytics/stats
 * @desc    Retrieve system-wide operational summary statistics
 * @access  Private
 */
router.get(
  '/stats',
  asyncHandler(getSystemStats)
);

/**
 * @route   GET /analytics/overdue-summary
 * @desc    Retrieve active borrowings exceeding return deadlines grouped by member
 * @access  Private
 */
router.get(
  '/overdue-summary',
  asyncHandler(getOverdueSummary)
);

export default router;

import { Router } from 'express';
import { createBook, getBooks, getBookById, updateBook } from './book.controller';
import { createBookSchema, updateBookSchema } from './book.validation';
import { validateRequest } from '../../validators/authValidator';
import { authenticate } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Shield all book operations under JWT authentication
router.use(authenticate);

/**
 * @route   POST /books
 * @desc    Create a new book record
 * @access  Private
 */
router.post(
  '/',
  validateRequest(createBookSchema),
  asyncHandler(createBook)
);

/**
 * @route   GET /books
 * @desc    Retrieve list of book records with filters
 * @access  Private
 */
router.get(
  '/',
  asyncHandler(getBooks)
);

/**
 * @route   GET /books/:id
 * @desc    Retrieve single book record detail by UUID
 * @access  Private
 */
router.get(
  '/:id',
  asyncHandler(getBookById)
);

/**
 * @route   PUT /books/:id
 * @desc    Update credentials or quantities of an existing book
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest(updateBookSchema),
  asyncHandler(updateBook)
);

export default router;

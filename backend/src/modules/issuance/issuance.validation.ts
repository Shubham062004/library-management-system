import { z } from 'zod';

/**
 * Validation schema for issuing a book to a member
 */
export const issueBookSchema = z.object({
  memberId: z.string().uuid('Invalid Member ID format (must be a valid UUID)'),
  bookId: z.string().uuid('Invalid Book ID format (must be a valid UUID)'),
  targetReturnDate: z.preprocess(
    (val) => {
      if (typeof val === 'string') return new Date(val);
      return val;
    },
    z.date().refine((date) => date > new Date(), {
      message: 'Target return date must be in the future',
    })
  ),
});

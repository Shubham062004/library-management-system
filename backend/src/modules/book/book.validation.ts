import { z } from 'zod';

/**
 * Validation schema for registering a book
 */
export const createBookSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    isbn: z.string().min(1, 'ISBN is required'),
    quantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative'),
    availableQuantity: z
      .number()
      .int('Available quantity must be an integer')
      .min(0, 'Available quantity cannot be negative'),
  })
  .refine((data) => data.availableQuantity <= data.quantity, {
    message: 'Available quantity cannot exceed total quantity',
    path: ['availableQuantity'],
  });

/**
 * Validation schema for updating a book
 */
export const updateBookSchema = z
  .object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    author: z.string().min(1, 'Author cannot be empty').optional(),
    isbn: z.string().min(1, 'ISBN cannot be empty').optional(),
    quantity: z
      .number()
      .int('Quantity must be an integer')
      .min(0, 'Quantity cannot be negative')
      .optional(),
    availableQuantity: z
      .number()
      .int('Available quantity must be an integer')
      .min(0, 'Available quantity cannot be negative')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.quantity !== undefined && data.availableQuantity !== undefined) {
        return data.availableQuantity <= data.quantity;
      }
      return true;
    },
    {
      message: 'Available quantity cannot exceed total quantity',
      path: ['availableQuantity'],
    }
  );

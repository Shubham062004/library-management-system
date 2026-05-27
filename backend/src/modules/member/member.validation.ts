import { z } from 'zod';

/**
 * Validation schema for creating a member
 */
export const createMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone is required'),
  membershipDate: z.preprocess((val) => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }, z.date().optional()),
});

/**
 * Validation schema for updating a member
 */
export const updateMemberSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  phone: z.string().min(1, 'Phone cannot be empty').optional(),
  membershipDate: z.preprocess((val) => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }, z.date().optional()),
});

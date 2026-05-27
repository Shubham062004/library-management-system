import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Zod schema for login validation
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Express middleware to validate request bodies against Zod schemas
 */
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    
    if (!parseResult.success) {
      const errorMap = parseResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMap,
      });
    }
    
    next();
  };
};

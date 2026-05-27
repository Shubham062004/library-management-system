import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Reusable utility to wrap async request handlers and pipe errors to the global error middleware
 */
export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

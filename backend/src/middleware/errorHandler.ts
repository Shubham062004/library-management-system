import { Request, Response, NextFunction } from 'express';

/**
 * Centrally manages error handling pipelines across the Express application
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  const errors = err.errors || undefined;

  // Safe Console logging for non-testing environments
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[App Exception] ${err.stack || message}`);
  }

  // Intercept and normalize JWT verification exceptions
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Authentication token is invalid.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

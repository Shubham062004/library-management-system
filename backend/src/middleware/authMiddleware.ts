import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { config } from '../config';
import { UnauthorizedError, ForbiddenError } from '../errors/customErrors';

/**
 * Custom request contract containing the authenticated user object
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * JWT Verification Middleware
 */
export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Please log in to access this resource.');
    }

    const token = authHeader.split(' ')[1];
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      throw new UnauthorizedError('Authentication token is invalid or expired.');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedError('The user belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Role-Based Access Control (RBAC) Authorization Middleware
 */
export const requireRole = (role: string) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return next(new ForbiddenError('You do not have permission to access this resource.'));
    }
    next();
  };
};

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { config } from '../config';
import { validateRequest, loginSchema } from '../validators/authValidator';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';
import { UnauthorizedError } from '../errors/customErrors';

const router = Router();

/**
 * @route   POST /auth/login
 * @desc    Administrator authentication & JWT token generation
 * @access  Public
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
      },
    });
  })
);

/**
 * @route   GET /auth/me
 * @desc    Retrieve profile credentials of the logged-in administrator
 * @access  Private (Requires Bearer Token)
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: 'User credentials fetched successfully',
      data: {
        user: req.user,
      },
    });
  })
);

export default router;

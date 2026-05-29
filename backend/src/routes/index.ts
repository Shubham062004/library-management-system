import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

/**
 * @route   GET /
 * @desc    Professional API root welcome endpoint
 * @access  Public
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Library Management System API is running',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

/**
 * @route   GET /health
 * @desc    Verify backend server status and database connectivity
 * @access  Public
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    // Run a fast query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message || 'Database connection error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;


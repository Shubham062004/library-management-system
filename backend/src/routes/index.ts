import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @route   GET /health
 * @desc    Verify backend server status
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server running successfully',
  });
});

export default router;

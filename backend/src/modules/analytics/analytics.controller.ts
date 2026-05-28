import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const analyticsService = new AnalyticsService();

/**
 * Controller to fetch list of books that have never been issued
 */
export const getNeverBorrowedBooks = async (_req: Request, res: Response) => {
  const result = await analyticsService.getNeverBorrowedBooks();
  
  res.status(200).json({
    success: true,
    message: 'Never borrowed books retrieved successfully',
    data: result,
  });
};

/**
 * Controller to fetch list of active outstanding book borrowings
 */
export const getOutstandingBooks = async (_req: Request, res: Response) => {
  const result = await analyticsService.getOutstandingBooks();

  res.status(200).json({
    success: true,
    message: 'Outstanding books retrieved successfully',
    data: result,
  });
};

/**
 * Controller to fetch top 10 most borrowed books
 */
export const getTopBorrowedBooks = async (_req: Request, res: Response) => {
  const result = await analyticsService.getTopBorrowedBooks();

  res.status(200).json({
    success: true,
    message: 'Top borrowed books retrieved successfully',
    data: result,
  });
};

/**
 * Controller to retrieve general library operational parameters
 */
export const getSystemStats = async (_req: Request, res: Response) => {
  const result = await analyticsService.getSystemStats();

  res.status(200).json({
    success: true,
    message: 'Library statistics retrieved successfully',
    data: result,
  });
};

/**
 * Controller to retrieve overdue statistics and lists
 */
export const getOverdueSummary = async (_req: Request, res: Response) => {
  const result = await analyticsService.getOverdueSummary();

  res.status(200).json({
    success: true,
    message: 'Overdue statistics summary retrieved successfully',
    data: result,
  });
};

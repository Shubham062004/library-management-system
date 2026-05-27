import { Request, Response } from 'express';
import { IssuanceService } from './issuance.service';
import { IssueBookInput } from './issuance.types';

const issuanceService = new IssuanceService();

/**
 * Controller to issue a library book
 */
export const issueBook = async (req: Request, res: Response) => {
  const input: IssueBookInput = req.body;
  const result = await issuanceService.issueBook(input);

  res.status(201).json({
    success: true,
    message: 'Book issued successfully',
    data: result,
  });
};

/**
 * Controller to return a borrowed library book
 */
export const returnBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await issuanceService.returnBook(id);

  res.status(200).json({
    success: true,
    message: 'Book returned successfully',
    data: result,
  });
};

/**
 * Controller to list all library issuance records with query filter variables
 */
export const getIssuances = async (req: Request, res: Response) => {
  const { page, limit, sortBy, sortOrder, status, memberId, bookId } = req.query;
  const result = await issuanceService.getIssuances({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
    status: status as 'ISSUED' | 'RETURNED',
    memberId: memberId as string,
    bookId: bookId as string,
  });

  res.status(200).json({
    success: true,
    message: 'Issuances retrieved successfully',
    data: result,
  });
};

/**
 * Controller to fetch specific issuance record detail by UUID
 */
export const getIssuanceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await issuanceService.getIssuanceById(id);

  res.status(200).json({
    success: true,
    message: 'Issuance details retrieved successfully',
    data: result,
  });
};

/**
 * Controller to retrieve outstanding unreturned borrow records
 */
export const getOutstandingIssuances = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const result = await issuanceService.getOutstandingIssuances({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.status(200).json({
    success: true,
    message: 'Outstanding issuances retrieved successfully',
    data: result,
  });
};

/**
 * Controller to retrieve overdue active borrow records
 */
export const getOverdueIssuances = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const result = await issuanceService.getOverdueIssuances({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.status(200).json({
    success: true,
    message: 'Overdue issuances retrieved successfully',
    data: result,
  });
};

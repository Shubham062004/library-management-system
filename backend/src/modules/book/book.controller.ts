import { Request, Response } from 'express';
import { BookService } from './book.service';
import { CreateBookInput, UpdateBookInput } from './book.types';

const bookService = new BookService();

/**
 * Controller to register a new book
 */
export const createBook = async (req: Request, res: Response) => {
  const input: CreateBookInput = req.body;
  const book = await bookService.createBook(input);

  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: book,
  });
};

/**
 * Controller to list books with pagination, search, sorting, and specific filters
 */
export const getBooks = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder, available, lowStock } = req.query;
  const result = await bookService.getBooks({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
    available: available as string,
    lowStock: lowStock as string,
  });

  res.status(200).json({
    success: true,
    message: 'Books retrieved successfully',
    data: result,
  });
};

/**
 * Controller to fetch specific book detail by UUID
 */
export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await bookService.getBookById(id);

  res.status(200).json({
    success: true,
    message: 'Book details retrieved successfully',
    data: book,
  });
};

/**
 * Controller to update an existing book
 */
export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const input: UpdateBookInput = req.body;
  const book = await bookService.updateBook(id, input);

  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: book,
  });
};

import { prisma } from '../../prisma';
import { CreateBookInput, UpdateBookInput, BookQueryFilters } from './book.types';
import { BadRequestError, NotFoundError } from '../../errors/customErrors';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  ALLOWED_SORT_FIELDS,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  LOW_STOCK_THRESHOLD,
} from './book.constants';

export class BookService {
  /**
   * Register a new book record
   */
  public async createBook(data: CreateBookInput) {
    const existingBook = await prisma.book.findUnique({
      where: { isbn: data.isbn },
    });

    if (existingBook) {
      throw new BadRequestError(`A book with ISBN ${data.isbn} already exists.`);
    }

    if (data.availableQuantity > data.quantity) {
      throw new BadRequestError('Available quantity cannot exceed total quantity.');
    }

    return await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        quantity: data.quantity,
        availableQuantity: data.availableQuantity,
      },
    });
  }

  /**
   * List paginated books with search, sort, and specific catalog status filters
   */
  public async getBooks(filters: BookQueryFilters) {
    const page = Math.max(1, Number(filters.page || DEFAULT_PAGE));
    const limit = Math.max(1, Number(filters.limit || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const search = filters.search || '';
    const sortBy = ALLOWED_SORT_FIELDS.includes(filters.sortBy || '')
      ? filters.sortBy
      : DEFAULT_SORT_BY;
    const sortOrder = filters.sortOrder === 'asc' ? 'asc' : DEFAULT_SORT_ORDER;

    // Map filters to prisma query filters
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filters.available === 'true') {
      where.availableQuantity = { gt: 0 };
    }

    if (filters.lowStock === 'true') {
      where.availableQuantity = { lte: LOW_STOCK_THRESHOLD };
    }

    // Run queries concurrently
    const [total, books] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy as string]: sortOrder,
        },
      }),
    ]);

    return {
      books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Fetch a single book catalog by UUID
   */
  public async getBookById(id: string) {
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundError(`Book with ID ${id} not found.`);
    }

    return book;
  }

  /**
   * Update credentials and quantities of an existing book
   */
  public async updateBook(id: string, data: UpdateBookInput) {
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundError(`Book with ID ${id} not found.`);
    }

    // Check duplicate ISBN if isbn is being changed
    if (data.isbn && data.isbn !== book.isbn) {
      const existingBook = await prisma.book.findUnique({
        where: { isbn: data.isbn },
      });

      if (existingBook) {
        throw new BadRequestError(`A book with ISBN ${data.isbn} already exists.`);
      }
    }

    // Combined inventory boundaries check
    const finalQuantity = data.quantity !== undefined ? data.quantity : book.quantity;
    const finalAvailable =
      data.availableQuantity !== undefined ? data.availableQuantity : book.availableQuantity;

    if (finalAvailable > finalQuantity) {
      throw new BadRequestError('Available quantity cannot exceed total quantity.');
    }

    return await prisma.book.update({
      where: { id },
      data,
    });
  }
}

export default BookService;

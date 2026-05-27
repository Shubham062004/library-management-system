import { prisma } from '../../prisma';
import { IssueBookInput, IssuanceQueryFilters } from './issuance.types';
import { BadRequestError, NotFoundError } from '../../errors/customErrors';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  ALLOWED_SORT_FIELDS,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from './issuance.constants';

export class IssuanceService {
  /**
   * Issue a library book to a member inside an atomic transaction
   */
  public async issueBook(data: IssueBookInput) {
    return await prisma.$transaction(async (tx) => {
      // 1. Verify member exists
      const member = await tx.member.findUnique({
        where: { id: data.memberId },
      });

      if (!member) {
        throw new NotFoundError(`Member with ID ${data.memberId} not found.`);
      }

      // 2. Verify book exists
      const book = await tx.book.findUnique({
        where: { id: data.bookId },
      });

      if (!book) {
        throw new NotFoundError(`Book with ID ${data.bookId} not found.`);
      }

      // 3. Ensure book is in stock
      if (book.availableQuantity <= 0) {
        throw new BadRequestError(`Book '${book.title}' is currently unavailable (out of stock).`);
      }

      // 4. Create issuance record
      const issuance = await tx.issuance.create({
        data: {
          memberId: data.memberId,
          bookId: data.bookId,
          targetReturnDate: data.targetReturnDate,
          status: 'ISSUED',
        },
        include: {
          member: {
            select: { id: true, name: true, email: true },
          },
          book: {
            select: { id: true, title: true, author: true, isbn: true },
          },
        },
      });

      // 5. Decrement book availableQuantity by 1
      await tx.book.update({
        where: { id: data.bookId },
        data: {
          availableQuantity: { decrement: 1 },
        },
      });

      return issuance;
    });
  }

  /**
   * Return a borrowed book inside an atomic transaction
   */
  public async returnBook(id: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Locate issuance
      const issuance = await tx.issuance.findUnique({
        where: { id },
      });

      if (!issuance) {
        throw new NotFoundError(`Issuance record with ID ${id} not found.`);
      }

      // 2. Ensure book has not already been returned
      if (issuance.status === 'RETURNED') {
        throw new BadRequestError('Book has already been returned.');
      }

      // 3. Update status & record actualReturnDate
      const updatedIssuance = await tx.issuance.update({
        where: { id },
        data: {
          status: 'RETURNED',
          actualReturnDate: new Date(),
        },
        include: {
          member: {
            select: { id: true, name: true, email: true },
          },
          book: {
            select: { id: true, title: true, author: true, isbn: true },
          },
        },
      });

      // 4. Increment book availableQuantity by 1
      await tx.book.update({
        where: { id: issuance.bookId },
        data: {
          availableQuantity: { increment: 1 },
        },
      });

      return updatedIssuance;
    });
  }

  /**
   * Retrieve list of issuances with dynamic filtering and pagination support
   */
  public async getIssuances(filters: IssuanceQueryFilters) {
    const page = Math.max(1, Number(filters.page || DEFAULT_PAGE));
    const limit = Math.max(1, Number(filters.limit || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const sortBy = ALLOWED_SORT_FIELDS.includes(filters.sortBy || '')
      ? filters.sortBy
      : DEFAULT_SORT_BY;
    const sortOrder = filters.sortOrder === 'asc' ? 'asc' : DEFAULT_SORT_ORDER;

    // Filter criteria mapping
    const where: any = {};
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.memberId) {
      where.memberId = filters.memberId;
    }
    if (filters.bookId) {
      where.bookId = filters.bookId;
    }

    // Run parallel queries
    const [total, issuances] = await Promise.all([
      prisma.issuance.count({ where }),
      prisma.issuance.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy as string]: sortOrder,
        },
        include: {
          member: {
            select: { id: true, name: true, email: true },
          },
          book: {
            select: { id: true, title: true, author: true, isbn: true },
          },
        },
      }),
    ]);

    return {
      issuances,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Fetch specific issuance detail by UUID
   */
  public async getIssuanceById(id: string) {
    const issuance = await prisma.issuance.findUnique({
      where: { id },
      include: {
        member: {
          select: { id: true, name: true, email: true },
        },
        book: {
          select: { id: true, title: true, author: true, isbn: true },
        },
      },
    });

    if (!issuance) {
      throw new NotFoundError(`Issuance record with ID ${id} not found.`);
    }

    return issuance;
  }

  /**
   * Fetch outstanding borrowed books (currently active/unreturned)
   */
  public async getOutstandingIssuances(filters: { page?: number; limit?: number }) {
    const page = Math.max(1, Number(filters.page || DEFAULT_PAGE));
    const limit = Math.max(1, Number(filters.limit || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const where = { status: 'ISSUED' as const };

    const [total, issuances] = await Promise.all([
      prisma.issuance.count({ where }),
      prisma.issuance.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          targetReturnDate: 'asc',
        },
        include: {
          member: {
            select: { id: true, name: true, email: true },
          },
          book: {
            select: { id: true, title: true, author: true, isbn: true },
          },
        },
      }),
    ]);

    return {
      issuances,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Fetch active borrowed books that have passed their return deadline
   */
  public async getOverdueIssuances(filters: { page?: number; limit?: number }) {
    const page = Math.max(1, Number(filters.page || DEFAULT_PAGE));
    const limit = Math.max(1, Number(filters.limit || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const now = new Date();
    const where = {
      status: 'ISSUED' as const,
      targetReturnDate: { lt: now },
    };

    const [total, issuances] = await Promise.all([
      prisma.issuance.count({ where }),
      prisma.issuance.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          targetReturnDate: 'asc',
        },
        include: {
          member: {
            select: { id: true, name: true, email: true },
          },
          book: {
            select: { id: true, title: true, author: true, isbn: true },
          },
        },
      }),
    ]);

    // Dynamically calculate overdue days count for response mapping
    const mappedIssuances = issuances.map((issuance) => {
      const diffTime = Math.abs(now.getTime() - issuance.targetReturnDate.getTime());
      const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...issuance,
        overdueDays,
      };
    });

    return {
      issuances: mappedIssuances,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default IssuanceService;

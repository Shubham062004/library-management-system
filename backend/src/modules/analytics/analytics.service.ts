import { prisma } from '../../prisma';
import {
  NeverBorrowedBookResult,
  OutstandingBookResult,
  TopBorrowedBookResult,
  SystemStatsResult,
} from './analytics.types';
import { DEFAULT_TOP_LIMIT } from './analytics.constants';

export class AnalyticsService {
  /**
   * 1. Books Never Borrowed
   * Left Joins Books to Issuances, returning catalog elements with no borrow records
   */
  public async getNeverBorrowedBooks(): Promise<NeverBorrowedBookResult[]> {
    return await prisma.$queryRaw<NeverBorrowedBookResult[]>`
      SELECT b.title AS "bookTitle", b.author
      FROM "Book" b
      LEFT JOIN "Issuance" i ON b.id = i."bookId"
      WHERE i."bookId" IS NULL
      ORDER BY b.title ASC;
    `;
  }

  /**
   * 2. Outstanding Books
   * Joins active borrowings to respective member and book parents
   */
  public async getOutstandingBooks(): Promise<OutstandingBookResult[]> {
    return await prisma.$queryRaw<OutstandingBookResult[]>`
      SELECT
        m.name AS "memberName",
        b.title AS "bookTitle",
        i."issueDate" AS "issueDate",
        i."targetReturnDate" AS "targetReturnDate",
        b.author
      FROM "Issuance" i
      JOIN "Member" m ON i."memberId" = m.id
      JOIN "Book" b ON i."bookId" = b.id
      WHERE i.status = 'ISSUED'
      ORDER BY i."issueDate" DESC;
    `;
  }

  /**
   * 3. Top 10 Most Borrowed Books
   * Groups borrowing transactions by book record, counting total borrow counts and unique member counts
   */
  public async getTopBorrowedBooks(): Promise<TopBorrowedBookResult[]> {
    return await prisma.$queryRaw<TopBorrowedBookResult[]>`
      SELECT
        b.title AS "bookTitle",
        COUNT(i.id)::int AS "borrowCount",
        COUNT(DISTINCT i."memberId")::int AS "uniqueMembers"
      FROM "Issuance" i
      JOIN "Book" b ON i."bookId" = b.id
      GROUP BY b.id, b.title
      ORDER BY "borrowCount" DESC, "uniqueMembers" DESC
      LIMIT ${DEFAULT_TOP_LIMIT};
    `;
  }

  /**
   * GET /analytics/stats
   * Fetch system-wide operational parameters concurrently
   */
  public async getSystemStats(): Promise<SystemStatsResult> {
    const now = new Date();
    const [totalBooks, totalMembers, activeIssuances, overdueBooks] = await Promise.all([
      prisma.book.count(),
      prisma.member.count(),
      prisma.issuance.count({ where: { status: 'ISSUED' } }),
      prisma.issuance.count({
        where: {
          status: 'ISSUED',
          targetReturnDate: { lt: now },
        },
      }),
    ]);

    return {
      totalBooks,
      totalMembers,
      activeIssuances,
      overdueBooks,
    };
  }

  /**
   * GET /analytics/overdue-summary
   * Compiles total overdue count, distinct overdue members count, and details grouped by member
   */
  public async getOverdueSummary() {
    const now = new Date();

    // 1. Fetch member overdue aggregates using optimized raw SQL
    const memberAggregates = await prisma.$queryRaw<
      { memberName: string; email: string; overdueCount: number }[]
    >`
      SELECT
        m.name AS "memberName",
        m.email AS "email",
        COUNT(i.id)::int AS "overdueCount"
      FROM "Issuance" i
      JOIN "Member" m ON i."memberId" = m.id
      WHERE i.status = 'ISSUED' AND i."targetReturnDate" < ${now}
      GROUP BY m.id, m.name, m.email
      ORDER BY "overdueCount" DESC;
    `;

    // 2. Fetch specific overdue borrow records to map corresponding books
    const overdueDetails = await prisma.issuance.findMany({
      where: {
        status: 'ISSUED',
        targetReturnDate: { lt: now },
      },
      include: {
        member: {
          select: { name: true, email: true },
        },
        book: {
          select: { title: true, author: true },
        },
      },
      orderBy: {
        targetReturnDate: 'asc',
      },
    });

    // 3. Map details to calculate elapsed overdue days count
    const mappedDetails = overdueDetails.map((item) => {
      const diffTime = Math.abs(now.getTime() - item.targetReturnDate.getTime());
      const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        memberName: item.member.name,
        email: item.member.email,
        bookTitle: item.book.title,
        author: item.book.author,
        issueDate: item.issueDate,
        targetReturnDate: item.targetReturnDate,
        overdueDays,
      };
    });

    return {
      overdueCounts: {
        totalOverdueBooks: overdueDetails.length,
        totalOverdueMembers: memberAggregates.length,
      },
      overdueMembers: memberAggregates,
      overdueBooks: mappedDetails,
    };
  }
}

export default AnalyticsService;

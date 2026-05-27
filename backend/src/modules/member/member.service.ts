import { prisma } from '../../prisma';
import { CreateMemberInput, UpdateMemberInput, MemberQueryFilters } from './member.types';
import { BadRequestError, NotFoundError } from '../../errors/customErrors';
import { DEFAULT_PAGE, DEFAULT_LIMIT, ALLOWED_SORT_FIELDS, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from './member.constants';

export class MemberService {
  /**
   * Create a new library member
   */
  public async createMember(data: CreateMemberInput) {
    const existingMember = await prisma.member.findUnique({
      where: { email: data.email },
    });

    if (existingMember) {
      throw new BadRequestError(`A member with email ${data.email} already exists.`);
    }

    return await prisma.member.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        membershipDate: data.membershipDate || new Date(),
      },
    });
  }

  /**
   * Fetch paginated list of members with search and sorting configurations
   */
  public async getMembers(filters: MemberQueryFilters) {
    const page = Math.max(1, Number(filters.page || DEFAULT_PAGE));
    const limit = Math.max(1, Number(filters.limit || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const search = filters.search || '';
    const sortBy = ALLOWED_SORT_FIELDS.includes(filters.sortBy || '')
      ? filters.sortBy
      : DEFAULT_SORT_BY;
    const sortOrder = filters.sortOrder === 'asc' ? 'asc' : DEFAULT_SORT_ORDER;

    // Filter criteria mapping
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // parallel queries for count and subset fetching to improve throughput
    const [total, members] = await Promise.all([
      prisma.member.count({ where }),
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy as string]: sortOrder,
        },
      }),
    ]);

    return {
      members,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Fetch details of a single member by their UUID
   */
  public async getMemberById(id: string) {
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundError(`Member with ID ${id} not found.`);
    }

    return member;
  }

  /**
   * Update credentials of an existing member
   */
  public async updateMember(id: string, data: UpdateMemberInput) {
    // Verify member exists
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundError(`Member with ID ${id} not found.`);
    }

    // Verify email uniqueness if changing email parameters
    if (data.email && data.email !== member.email) {
      const existingMember = await prisma.member.findUnique({
        where: { email: data.email },
      });

      if (existingMember) {
        throw new BadRequestError(`A member with email ${data.email} already exists.`);
      }
    }

    return await prisma.member.update({
      where: { id },
      data,
    });
  }
}
export default MemberService;

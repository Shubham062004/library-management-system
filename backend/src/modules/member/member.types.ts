/**
 * Data input interface for creating a new member
 */
export interface CreateMemberInput {
  name: string;
  email: string;
  phone: string;
  membershipDate?: Date;
}

/**
 * Data input interface for updating an existing member
 */
export interface UpdateMemberInput {
  name?: string;
  email?: string;
  phone?: string;
  membershipDate?: Date;
}

/**
 * Filter options for listing and searching members
 */
export interface MemberQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

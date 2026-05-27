import { Request, Response } from 'express';
import { MemberService } from './member.service';
import { CreateMemberInput, UpdateMemberInput } from './member.types';

const memberService = new MemberService();

/**
 * Controller to create a new member
 */
export const createMember = async (req: Request, res: Response) => {
  const input: CreateMemberInput = req.body;
  const member = await memberService.createMember(input);
  
  res.status(201).json({
    success: true,
    message: 'Member created successfully',
    data: member,
  });
};

/**
 * Controller to list members with pagination filters
 */
export const getMembers = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = req.query;
  const result = await memberService.getMembers({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  res.status(200).json({
    success: true,
    message: 'Members retrieved successfully',
    data: result,
  });
};

/**
 * Controller to retrieve a single member by their UUID
 */
export const getMemberById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const member = await memberService.getMemberById(id);

  res.status(200).json({
    success: true,
    message: 'Member details retrieved successfully',
    data: member,
  });
};

/**
 * Controller to update a member
 */
export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const input: UpdateMemberInput = req.body;
  const member = await memberService.updateMember(id, input);

  res.status(200).json({
    success: true,
    message: 'Member updated successfully',
    data: member,
  });
};

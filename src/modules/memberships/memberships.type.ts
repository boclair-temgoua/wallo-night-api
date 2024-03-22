import { PaginationType } from '../../app/utils/pagination';
import { Membership } from '../../models/Membership';

export type GetMembershipsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Membership['userId'];
  organizationId?: Membership['organizationId'];
};

export type GetOneMembershipsSelections = {
  membershipId: Membership['id'];
  organizationId?: Membership['organizationId'];
};

export type UpdateMembershipsSelections = {
  membershipId: Membership['id'];
};

export type CreateMembershipsOptions = Partial<Membership>;

export type UpdateMembershipsOptions = Partial<Membership>;

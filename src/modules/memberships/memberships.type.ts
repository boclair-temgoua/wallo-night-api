import { Membership } from '../../models/Membership';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetMembershipsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Membership['userId'];
};

export type GetOneMembershipsSelections = {
  membershipId: Membership['id'];
};

export type UpdateMembershipsSelections = {
  membershipId: Membership['id'];
};

export type CreateMembershipsOptions = Partial<Membership>;

export type UpdateMembershipsOptions = Partial<Membership>;

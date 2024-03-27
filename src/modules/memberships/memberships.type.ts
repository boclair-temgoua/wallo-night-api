import { PaginationType } from '../../app/utils/pagination';
import { Membership } from '../../models/Membership';

export type GetMembershipsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Membership['userId'];
  isVisible?: Membership['isVisible'];
  organizationId?: Membership['organizationId'];
};

export type GetOneMembershipsSelections = {
  membershipId: Membership['id'];
  isVisible?: Membership['isVisible'];
  organizationId?: Membership['organizationId'];
};

export type UpdateMembershipsSelections = {
  membershipId: Membership['id'];
};

export type CreateMembershipsOptions = Partial<Membership>;

export type UpdateMembershipsOptions = Partial<Membership>;

import { PaginationType } from '../../app/utils/pagination';
import { Contributor } from '../../models/Contributor';

export type ContributorRole = 'ADMIN' | 'MEMBER' | 'SUPERADMIN' | 'MODERATOR';

export type ContributorStatus =
  | 'CONTRIBUTOR'
  | 'INVITED-CONTRIBUTOR'
  | 'NEW-CONTRIBUTOR';

export const contributorStatusArrays = [
  'CONTRIBUTOR',
  'INVITED-CONTRIBUTOR',
  'NEW-CONTRIBUTOR',
];

export const contributorRoleArrays = [
  'ADMIN',
  'MEMBER',
  'SUPERADMIN',
  'MODERATOR',
];

export type TokenContributorModel = {
  userId: string;
  contributorId: string;
  userContributorId: string;
  contributorStatus: ContributorStatus;
  guest: {
    lastName: string;
    firstName: string;
  };
  user: {
    email: string;
    lastName: string;
    firstName: string;
    organizationName: string;
  };
};
export type GetContributorsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Contributor['userId'];
  organizationId?: Contributor['organizationId'];
};

export type GetOneContributorSelections = {
  type?: Contributor['type'];
  userId?: Contributor['userId'];
  contributorId?: Contributor['id'];
  organizationId?: Contributor['organizationId'];
};

export type UpdateContributorSelections = {
  contributorId: Contributor['id'];
};

export type DeleteContributorSelections = {
  contributorId: Contributor['id'];
};

export type CreateContributorOptions = Partial<Contributor>;

export type UpdateContributorOptions = Partial<Contributor>;

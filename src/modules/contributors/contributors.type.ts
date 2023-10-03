import { Contributor } from '../../models/Contributor';
import { PaginationType } from '../../app/utils/pagination';

export type ContributorRole =
  | 'ADMIN'
  | 'MODERATOR'
  | 'EDITOR'
  | 'GHOST'
  | 'ANALYST';

export const contributorRoleArrays = [
  'ADMIN',
  'MODERATOR',
  'EDITOR',
  'GHOST',
  'ANALYST',
];

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

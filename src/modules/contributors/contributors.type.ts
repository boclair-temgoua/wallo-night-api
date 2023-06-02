import { Contributor } from '../../models/Contributor';
import { PaginationType } from '../../app/utils/pagination';

export enum ContributorRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  EDITOR = 'EDITOR',
  GHOST = 'GHOST',
  ANALYST = 'ANALYST',
}

export type GetContributorsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Contributor['userId'];
  organizationId?: Contributor['organizationId'];
};

export type GetOneContributorSelections = {
  type?: Contributor['type'];
  userId?: Contributor['userId'];
  organizationId?: Contributor['organizationId'];
  contributorId?: Contributor['id'];
};

export type UpdateContributorSelections = {
  contributorId: Contributor['id'];
};

export type DeleteContributorSelections = {
  contributorId: Contributor['id'];
};

export type CreateContributorOptions = Partial<Contributor>;

export type UpdateContributorOptions = Partial<Contributor>;

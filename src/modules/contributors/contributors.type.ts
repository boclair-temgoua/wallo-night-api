import { Contributor } from '../../models/Contributor';
import { PaginationType } from '../../app/utils/pagination';

export enum ContributorRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  EDITOR = 'EDITOR',
  GHOST = 'GHOST',
}

export type GetContributorsSelections = {
  search?: string;
  pagination?: PaginationType;
  type: Contributor['type'];
  userId?: Contributor['userId'];
  organizationId?: Contributor['organizationId'];
  projectId?: Contributor['projectId'];
  subProjectId?: Contributor['subProjectId'];
};

export type GetOneContributorSelections = {
  type?: Contributor['type'];
  userId?: Contributor['userId'];
  organizationId?: Contributor['organizationId'];
  projectId?: Contributor['projectId'];
  subProjectId?: Contributor['subProjectId'];
  contributorId?: Contributor['id'];
};

export type UpdateContributorSelections = {
  option1?: {
    contributorId: Contributor['id'];
  };
};

export type DeleteContributorSelections = {
  option1?: {
    contributorId: Contributor['id'];
  };
};

export type CreateContributorOptions = Partial<Contributor>;

export type UpdateContributorOptions = Partial<Contributor>;

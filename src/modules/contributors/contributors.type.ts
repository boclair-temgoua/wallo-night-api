import { Contributor } from '../../models/Contributor';
import { PaginationType, SortType } from '../../app/utils/pagination';

export enum ContributorRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  EDITOR = 'EDITOR',
  GHOST = 'GHOST',
}

export enum ContributorType {
  ORGANIZATION = 'ORGANIZATION',
}

export type GetContributorsSelections = {
  search?: string;
  pagination?: PaginationType;
  option1?: {
    organizationId: Contributor['organizationId'];
  };
  option2?: {
    userId: Contributor['userId'];
  };
};

export type GetOneContributorSelections = {
  option1?: {
    userId: Contributor['userId'];
    organizationId: Contributor['organizationId'];
  };
  option2?: { contributorId: Contributor['id'] };
  option3?: {
    contributorId: Contributor['id'];
    organizationId: Contributor['organizationId'];
  };
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

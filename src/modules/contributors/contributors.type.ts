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
  option1?: {
    type: Contributor['type'];
    userId: Contributor['userId'];
  };
  option2?: {
    type: Contributor['type'];
    userId: Contributor['userId'];
    projectId: Contributor['projectId'];
    organizationId: Contributor['organizationId'];
  };
  option3?: {
    type: Contributor['type'];
    projectId: Contributor['projectId'];
    organizationId: Contributor['organizationId'];
  };
  option4?: {
    type: Contributor['type'];
    projectId: Contributor['projectId'];
    subProjectId: Contributor['subProjectId'];
    organizationId: Contributor['organizationId'];
  };
  option5?: {
    type: Contributor['type'];
    organizationId: Contributor['organizationId'];
  };
};

export type GetOneContributorSelections = {
  option1?: {
    type: Contributor['type'];
    userId: Contributor['userId'];
    organizationId: Contributor['organizationId'];
  };
  option2?: { contributorId: Contributor['id'] };
  option3?: {
    contributorId: Contributor['id'];
    organizationId: Contributor['organizationId'];
  };
  option4?: {
    type: Contributor['type'];
    userId: Contributor['userId'];
    projectId: Contributor['projectId'];
    organizationId: Contributor['organizationId'];
  };
  option5?: {
    type: Contributor['type'];
    userId: Contributor['userId'];
    projectId: Contributor['projectId'];
    subProjectId: Contributor['subProjectId'];
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

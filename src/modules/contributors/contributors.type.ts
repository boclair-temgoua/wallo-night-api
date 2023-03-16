import { Contributor } from '../../models/Contributor';
import { SortType } from '../../app/utils/pagination';

export enum ContributorRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  EDITOR = 'EDITOR',
  GHOST = 'GHOST',
}

export type GetContributorsSelections = {
  is_paginate?: boolean;
  filterQuery?: any;
  data?: any[];
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
  option1?: {
    userId: Contributor['userId'];
    contributeType: Contributor['contributeType'];
  };
  option2?: {
    contributeId: Contributor['contributeId'];
    contributeType: Contributor['contributeType'];
  };
};

export type GetOneContributorSelections = {
  option1?: {
    contributorId: Contributor['id'];
  };
  option2?: {
    userId: Contributor['userId'];
    contributeId: Contributor['contributeId'];
    contributeType: Contributor['contributeType'];
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

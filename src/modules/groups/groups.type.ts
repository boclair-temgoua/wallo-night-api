import { Group } from '../../models/Group';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetGroupsSelections = {
  search?: string;
  organizationId?: Group['organizationId'];
  projectId?: Group['projectId'];
  subProjectId?: Group['subProjectId'];
  subSubProjectId?: Group['subSubProjectId'];
  subSubSubProjectId?: Group['subSubSubProjectId'];
  pagination?: PaginationType;
};

export type GetOneGroupSelections = {
  groupId?: Group['id'];
  subSubSubProjectId?: Group['subSubSubProjectId'];
  subSubProjectId?: Group['subSubProjectId'];
  subProjectId?: Group['subProjectId'];
  projectId?: Group['projectId'];
  organizationId?: Group['organizationId'];
};

export type UpdateGroupSelections = {
  option1?: {
    groupId: Group['id'];
  };
};

export type CreateGroupOptions = Partial<Group>;

export type UpdateGroupOptions = Partial<Group>;

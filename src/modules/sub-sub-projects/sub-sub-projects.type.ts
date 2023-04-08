import { SubSubProject } from '../../models/SubSubProject';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetSubSubProjectsSelections = {
  search?: string;
  projectId?: SubSubProject['projectId'];
  subProjectId?: SubSubProject['subProjectId'];
  subSubProjectId?: SubSubProject['id'];
  organizationId?: SubSubProject['organizationId'];
  pagination?: PaginationType;
};

export type GetOneSubSubProjectSelections = {
  projectId?: SubSubProject['projectId'];
  subProjectId?: SubSubProject['subProjectId'];
  subSubProjectId: SubSubProject['id'];
};

export type UpdateSubSubProjectSelections = {
  option1?: { subSubProjectId: SubSubProject['id'] };
};

export type CreateSubSubProjectOptions = Partial<SubSubProject>;

export type UpdateSubSubProjectOptions = Partial<SubSubProject>;

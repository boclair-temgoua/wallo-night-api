import { SubSubSubProject } from '../../models/SubSubSubProject';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetSubSubSubProjectsSelections = {
  search?: string;
  projectId?: SubSubSubProject['projectId'];
  subProjectId?: SubSubSubProject['subProjectId'];
  subSubProjectId?: SubSubSubProject['subSubProjectId'];
  subSubSubProjectId?: SubSubSubProject['id'];
  organizationId?: SubSubSubProject['organizationId'];
  pagination?: PaginationType;
};

export type GetOneSubSubSubProjectSelections = {
  projectId?: SubSubSubProject['projectId'];
  subProjectId?: SubSubSubProject['subProjectId'];
  subSubProjectId?: SubSubSubProject['subSubProjectId'];
  subSubSubProjectId: SubSubSubProject['id'];
};

export type UpdateSubSubSubProjectSelections = {
  option1?: { subSubSubProjectId: SubSubSubProject['id'] };
};

export type CreateSubSubSubProjectOptions = Partial<SubSubSubProject>;

export type UpdateSubSubSubProjectOptions = Partial<SubSubSubProject>;

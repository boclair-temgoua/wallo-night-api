import { SubProject } from '../../models/SubProject';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetSubProjectsSelections = {
  search?: string;
  option1?: {
    organizationId: SubProject['organizationId'];
    projectId: SubProject['projectId'];
  };
  pagination?: PaginationType;
};

export type GetOneSubProjectSelections = {
  projectId?: SubProject['id'];
  subProjectId: SubProject['id'];
};

export type UpdateSubProjectSelections = {
  option1?: { subProjectId: SubProject['id'] };
};

export type CreateSubProjectOptions = Partial<SubProject>;

export type UpdateSubProjectOptions = Partial<SubProject>;

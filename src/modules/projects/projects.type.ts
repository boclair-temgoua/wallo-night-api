import { Project } from '../../models/Project';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetProjectsSelections = {
  search?: string;
  option1?: { organizationId: Project['organizationId'] };
  pagination?: PaginationType;
};

export type GetOneProjectSelections = {
  option1?: { projectId: Project['id'] };
};

export type UpdateProjectSelections = {
  option1?: { projectId: Project['id'] };
};

export type CreateProjectOptions = Partial<Project>;

export type UpdateProjectOptions = Partial<Project>;

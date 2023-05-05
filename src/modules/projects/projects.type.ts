import { Project } from '../../models/Project';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetProjectsSelections = {
  search?: string;
  userId?: Project['userId'];
  pagination?: PaginationType;
};

export type GetOneProjectSelections = {
  projectId: Project['id'];
};

export type UpdateProjectSelections = {
  projectId: Project['id'];
};

export type CreateProjectOptions = Partial<Project>;

export type UpdateProjectOptions = Partial<Project>;

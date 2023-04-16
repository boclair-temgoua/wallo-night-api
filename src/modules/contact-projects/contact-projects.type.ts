import { ContactProject } from '../../models/ContactProject';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetContactProjectSelections = {
  search?: string;
  type?: ContactProject['type'];
  organizationId?: ContactProject['organizationId'];
  projectId?: ContactProject['projectId'];
  subProjectId?: ContactProject['subProjectId'];
  subSubProjectId?: ContactProject['subSubProjectId'];
  subSubSubProjectId?: ContactProject['subSubSubProjectId'];
  pagination?: PaginationType;
};

export type GetOneContactProjectSelections = {
  type?: ContactProject['type'];
  contactProjectId?: ContactProject['id'];
  subSubSubProjectId?: ContactProject['subSubSubProjectId'];
  subSubProjectId?: ContactProject['subSubProjectId'];
  subProjectId?: ContactProject['subProjectId'];
  projectId?: ContactProject['projectId'];
  contactId?: ContactProject['contactId'];
  organizationId?: ContactProject['organizationId'];
};

export type UpdateContactProjectSelections = {
  contactProjectId?: ContactProject['id'];
};

export type CreateContactProjectOptions = Partial<ContactProject>;

export type UpdateContactProjectOptions = Partial<ContactProject>;

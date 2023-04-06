import { Contact } from '../../models/Contact';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export enum ContactType {
  ORGANIZATION = 'ORGANIZATION',
  PROJECT = 'PROJECT',
  SUBPROJECT = 'SUBPROJECT',
}

export type GetContactSelections = {
  search?: string;
  type: Contact['type'];
  organizationId: Contact['organizationId'];
  projectId: Contact['projectId'];
  subProjectId: Contact['subProjectId'];
  pagination?: PaginationType;
};

export type GetOneContactSelections = {
  option1?: {
    contactId: Contact['id'];
    organizationId: Contact['organizationId'];
  };
};

export type UpdateContactSelections = {
  option1?: {
    contactId: Contact['id'];
    organizationId: Contact['organizationId'];
  };
};

export type CreateContactOptions = Partial<Contact>;

export type UpdateContactOptions = Partial<Contact>;

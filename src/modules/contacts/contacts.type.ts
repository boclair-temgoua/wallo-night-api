import { Contact } from '../../models/Contact';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetContactSelections = {
  search?: string;
  organizationId?: Contact['organizationId'];
  pagination?: PaginationType;
};

export type GetOneContactSelections = {
  contactId?: Contact['id'];
  organizationId?: Contact['organizationId'];
};

export type UpdateContactSelections = {
  contactId?: Contact['id'];
};

export type CreateContactOptions = Partial<Contact>;

export type UpdateContactOptions = Partial<Contact>;

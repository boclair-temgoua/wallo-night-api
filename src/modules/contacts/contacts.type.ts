import { Contact } from '../../models/Contact';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetContactsSelections = {
  search?: string;
  option1?: { organizationId: Contact['organizationId'] };
  pagination?: PaginationType;
};

export type GetOneContactSelections = {
  option1?: { contactId: Contact['id'] };
};

export type UpdateContactSelections = {
  option1?: { contactId: Contact['id'] };
};

export type CreateContactOptions = Partial<Contact>;

export type UpdateContactOptions = Partial<Contact>;

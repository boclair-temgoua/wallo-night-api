import { PaginationType } from '../../app/utils/pagination';
import { Contact } from '../../models/Contact';

export type GetContactSelections = {
  search?: string;
  pagination?: PaginationType;
};

export type GetOneContactSelections = {
  contactId: Contact['id'];
};

export type UpdateContactSelections = {
  contactId: Contact['id'];
};

export type CreateContactOptions = Partial<Contact>;

export type UpdateContactOptions = Partial<Contact>;

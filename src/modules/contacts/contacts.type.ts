import { Contact } from '../../models/Contact';

export type GetContactsSelections = {
  search?: string;
};

export type GetOneContactSelections = {
  option1?: { contactId: Contact['id'] };
};

export type UpdateContactSelections = {
  option1?: { contactId: Contact['id'] };
};

export type CreateContactOptions = Partial<Contact>;

export type UpdateContactOptions = Partial<Contact>;

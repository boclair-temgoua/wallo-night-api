import { ContactUs } from '../../models/ContactUs';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetContactUsSelections = {
  search?: string;
  option1?: { organizationId: ContactUs['organizationId'] };
  pagination?: PaginationType;
};

export type GetOneContactUsSelections = {
  option1?: { contactUsId: ContactUs['id'] };
};

export type UpdateContactUsSelections = {
  option1?: { contactUsId: ContactUs['id'] };
};

export type CreateContactUsOptions = Partial<ContactUs>;

export type UpdateContactUsOptions = Partial<ContactUs>;

import { Faq } from '../../models/Faq';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetFaqsSelections = {
  search?: string;
  option1?: { userId: Faq['userId'] };
  pagination?: PaginationType;
};

export type GetOneFaqSelections = {
  faqId: Faq['id'];
};

export type UpdateFaqSelections = {
  faqId: Faq['id'];
};

export type CreateFaqOptions = Partial<Faq>;

export type UpdateFaqOptions = Partial<Faq>;

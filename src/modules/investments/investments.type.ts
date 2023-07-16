import { Investment } from '../../models/Investment';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetInvestmentsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Investment['userId'];
  donationId?: Investment['donationId'];
  organizationId?: Investment['organizationId'];
};

export type GetOneInvestmentSelections = {
  investmentId?: Investment['id'];
  donationId?: Investment['donationId'];
};

export type UpdateInvestmentSelections = {
  investmentId: Investment['id'];
};

export type CreateInvestmentOptions = Partial<Investment>;

export type UpdateInvestmentOptions = Partial<Investment>;

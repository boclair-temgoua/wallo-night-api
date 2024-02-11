import { PaginationType } from '../../app/utils/pagination';
import { Contribution } from '../../models';

export type GetContributionsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Contribution['userId'];
  organizationId?: Contribution['organizationId'];
  currencyId?: Contribution['currencyId'];
};

export type GetOneContributionSelections = {
  type?: Contribution['type'];
  userId?: Contribution['userId'];
  contributionId?: Contribution['id'];
};

export type UpdateContributionSelections = {
  contributionId: Contribution['id'];
};

export type CreateContributionOptions = Partial<Contribution>;

export type UpdateContributionOptions = Partial<Contribution>;

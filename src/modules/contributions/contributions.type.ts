import { Contribution } from '../../models';
import { PaginationType } from '../../app/utils/pagination';


export type GetContributionsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Contribution['userId'];
  donationId?: Contribution['donationId'];
  giftId?: Contribution['giftId'];
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

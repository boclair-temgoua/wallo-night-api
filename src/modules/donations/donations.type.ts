import { PaginationType } from '../../app/utils/pagination';
import { Donation } from '../../models';

export type GetDonationsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Donation['userId'];
};

export type GetOneDonationsSelections = {
  donationId: Donation['id'];
};

export type UpdateDonationsSelections = {
  donationId: Donation['id'];
};

export type CreateDonationsOptions = Partial<Donation>;

export type UpdateDonationsOptions = Partial<Donation>;

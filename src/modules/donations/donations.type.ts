import { Donation } from '../../models/Donation';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetDonationsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Donation['userId'];
  organizationId?: Donation['organizationId'];
};

export type GetOneDonationSelections = {
  donationId: Donation['id'];
};

export type UpdateDonationSelections = {
  donationId: Donation['id'];
};

export type CreateDonationOptions = Partial<Donation>;

export type UpdateDonationOptions = Partial<Donation>;

import { Gift } from '../../models/Gift';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetGiftsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Gift['userId'];
};

export type GetOneGiftsSelections = {
  giftId: Gift['id'];
};

export type UpdateGiftsSelections = {
  giftId: Gift['id'];
};

export type CreateGiftsOptions = Partial<Gift>;

export type UpdateGiftsOptions = Partial<Gift>;

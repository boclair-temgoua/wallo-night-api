import { Discount } from '../../models/Discount';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetDiscountsSelections = {
  search?: string;
  pagination?: PaginationType;
};

export type GetOneDiscountsSelections = {
  discountId: Discount['id'];
};

export type UpdateDiscountsSelections = {
  discountId: Discount['id'];
};

export type CreateDiscountsOptions = Partial<Discount>;

export type UpdateDiscountsOptions = Partial<Discount>;

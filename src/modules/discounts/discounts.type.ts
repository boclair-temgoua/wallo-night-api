import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { Discount } from '../../models/Discount';

export type GetDiscountsSelections = {
  search?: string;
  pagination?: PaginationType;
  organizationId?: Discount['organizationId'];
};

export type GetOneDiscountsSelections = {
  discountId?: Discount['id'];
  organizationId?: Discount['organizationId'];
};

export type UpdateDiscountsSelections = {
  discountId: Discount['id'];
};

export type CreateDiscountsOptions = Partial<Discount>;

export type UpdateDiscountsOptions = Partial<Discount>;

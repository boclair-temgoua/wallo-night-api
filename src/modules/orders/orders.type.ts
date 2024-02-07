import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { Order } from '../../models';

export type GetOrdersSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Order['userId'];
};

export type GetOneOrderSelections = {
  orderId: Order['id'];
};

export type UpdateOrderSelections = {
  orderId: Order['id'];
};

export type CreateOrderOptions = Partial<Order>;

export type UpdateOrderOptions = Partial<Order>;

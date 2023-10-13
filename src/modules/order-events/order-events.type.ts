import { OrderEvent } from '../../models';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetOrderEventsSelections = {
  search?: string;
  userId?: OrderEvent['userId'];
  pagination?: PaginationType;
};

export type GetOneOrderEventSelections = {
  orderEventId: OrderEvent['id'];
  organizationId?: OrderEvent['organizationId'];
};

export type UpdateOrderEventSelections = {
  orderEventId: OrderEvent['id'];
};

export type CreateOrderEventOptions = Partial<OrderEvent>;

export type UpdateOrderEventOptions = Partial<OrderEvent>;

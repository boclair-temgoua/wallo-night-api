import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { OrderItem } from '../../models';

export type OrderItemStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'OR_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export const orderItemStatusArrays = [
  'PENDING',
  'ACCEPTED',
  'OR_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export type GetOrderItemsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: OrderItem['userId'];
  orderId?: OrderItem['orderId'];
  model?: OrderItem['model'];
  organizationSellerId?: OrderItem['organizationSellerId'];
  organizationBeyerId?: OrderItem['organizationBeyerId'];
};

export type GetOneOrderItemSelections = {
  orderItemId: OrderItem['id'];
};

export type UpdateOrderItemSelections = {
  orderItemId: OrderItem['id'];
};

export type CreateOrderItemOptions = Partial<OrderItem>;

export type UpdateOrderItemOptions = Partial<OrderItem>;

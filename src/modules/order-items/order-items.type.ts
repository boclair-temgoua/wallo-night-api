import { PaginationType } from '../../app/utils/pagination';
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
  modelIds: any[];
  pagination?: PaginationType;
  userId?: OrderItem['userId'];
  orderId?: OrderItem['orderId'];
  model?: OrderItem['model'];
  organizationSellerId?: OrderItem['organizationSellerId'];
  organizationBuyerId?: OrderItem['organizationBuyerId'];
};

export type GetOneOrderItemSelections = {
  orderItemId?: OrderItem['id'];
  organizationSellerId?: OrderItem['organizationSellerId'];
  organizationBuyerId?: OrderItem['organizationBuyerId'];
};

export type UpdateOrderItemSelections = {
  orderItemId: OrderItem['id'];
};

export type CreateOrderItemOptions = Partial<OrderItem>;

export type UpdateOrderItemOptions = Partial<OrderItem>;

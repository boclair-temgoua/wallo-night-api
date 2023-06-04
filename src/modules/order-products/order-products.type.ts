import { PaginationType } from './../../app/utils/pagination/with-pagination';
import { OrderProduct } from '../../models/OrderProduct';

export type GetOrderProductsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: OrderProduct['userId'];
  organizationId?: OrderProduct['organizationId'];
};

export type GetOneOrderProductSelections = {
  orderProductId: OrderProduct['id'];
};

export type UpdateOrderProductSelections = {
  orderProductId: OrderProduct['id'];
};

export type CreateOrderProductOptions = Partial<OrderProduct>;

export type UpdateOrderProductOptions = Partial<OrderProduct>;

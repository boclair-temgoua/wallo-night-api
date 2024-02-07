import { CartOrder } from '../../models';

export type GetOneCartOrderSelections = {
  cartOrderId?: CartOrder['id'];
  userId?: CartOrder['userId'];
  organizationId?: CartOrder['organizationId'];
};

export type GetOneCartsSelections = {
  cartOrderId?: CartOrder['id'];
  userId?: CartOrder['userId'];
};

export type UpdateCartOrdersSelections = {
  cartOrderId: CartOrder['id'];
};

export type CreateCartOrderOptions = Partial<CartOrder>;

export type UpdateCartOrderOptions = Partial<CartOrder>;

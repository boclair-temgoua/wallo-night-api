import { CartOrder } from '../../models';

export type GetOneCartOrderSelections = {
  cartOrderId?: CartOrder['id'];
  userId?: CartOrder['userId'];
  organizationSellerId?: CartOrder['organizationSellerId'];
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

import { Category } from '../../models/Category';
import { Cart } from '../../models/Cart';
import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { StatusCart } from './cats.dto';

export type GetCartsSelections = {
  userId?: Cart['userId'];
  status: StatusCart;
  productId?: Cart['productId'];
  cartOrderId?: Cart['cartOrderId'];
  ipLocation?: Cart['ipLocation'];
};

export type GetOneCartsSelections = {
  cartId?: Cart['id'];
  userId?: Cart['userId'];
  productId?: Cart['productId'];
  status?: StatusCart;
  cartOrderId?: Cart['cartOrderId'];
};

export type UpdateCartsSelections = {
  cartId: Cart['id'];
};

export type CreateCartsOptions = Partial<Cart>;

export type UpdateCartsOptions = Partial<Cart>;

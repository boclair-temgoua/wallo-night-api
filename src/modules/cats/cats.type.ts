import { FilterQueryType } from '../../app/utils/search-query/search-query.dto';
import { Cart } from '../../models/Cart';
import { StatusCart } from './cats.dto';

type OnCart = {
  createdAt: Date;
  id: string;
  quantity: string;
  model: FilterQueryType;
  productId: string;
  commissionId: string;
  userId: string;
  cardOrganizationId: string;
  profileVendor: {
    color: string;
    image: string;
    userId: string;
    fullName: string;
    lastName: string;
    username: string;
    firstName: string;
  };
  uploadsImages: [
    {
      name: string;
      path: string;
      model: string;
      uploadType: string;
    },
  ];
  uploadsFiles: null;
  product: {
    id: string;
    slug: string;
    price: number;
    title: string;
    currency: {
      code: string;
      name: string;
      symbol: string;
    };
    discount: {
      isValid: boolean;
      percent: number;
      expiredAt: Date;
      enableExpiredAt: boolean;
    };
    productType: string;
    priceDiscount: number;
    organizationId: string;
  };
};

export type CartResponse = {
  summary: {
    totalQuantity: number;
    totalPriceDiscount: number;
    totalPriceNoDiscount: number;
    currency: string;
    userId: string;
  };
  cartItems: OnCart[];
};

export type GetCartsSelections = {
  userId?: Cart['userId'];
  status: StatusCart;
  productId?: Cart['productId'];
  cartOrderId?: Cart['cartOrderId'];
  ipLocation?: Cart['ipLocation'];
  currency?: Cart['currency'];
  organizationId?: Cart['organizationId'];
};

export type GetOneCartsSelections = {
  cartId?: Cart['id'];
  userId?: Cart['userId'];
  productId?: Cart['productId'];
  status?: StatusCart;
  currency?: Cart['currency'];
  cartOrderId?: Cart['cartOrderId'];
  organizationId?: Cart['organizationId'];
};

export type UpdateCartsSelections = {
  cartId: Cart['id'];
};

export type CreateCartsOptions = Partial<Cart>;

export type UpdateCartsOptions = Partial<Cart>;

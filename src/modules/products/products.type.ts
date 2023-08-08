import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetProductsSelections = {
  search?: string;
  pagination?: PaginationType;
};

export type GetOneProductsSelections = {
  productId: Product['id'];
};

export type UpdateProductsSelections = {
  productId: Product['id'];
};

export type CreateProductsOptions = Partial<Product>;

export type UpdateProductsOptions = Partial<Product>;

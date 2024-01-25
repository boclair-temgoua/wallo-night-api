import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { Product } from '../../models/Product';

export type GetProductsSelections = {
  search?: string;
  pagination?: PaginationType;
  status?: string;
  organizationId?: Product['organizationId'];
};

export type GetOneProductsSelections = {
  productId?: Product['id'];
  productSlug?: Product['slug'];
  organizationId?: Product['organizationId'];
};

export type UpdateProductsSelections = {
  productId: Product['id'];
};

export type CreateProductsOptions = Partial<Product>;

export type UpdateProductsOptions = Partial<Product>;

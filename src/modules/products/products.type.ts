import { PaginationType } from '../../app/utils/pagination';
import { Product } from '../../models/Product';

export type GetProductsSelections = {
  search?: string;
  pagination?: PaginationType;
  status?: string;
  modelIds: [];
  enableVisibility?: string;
  organizationId?: Product['organizationId'];
};

export type GetOneProductsSelections = {
  productId?: Product['id'];
  productSlug?: Product['slug'];
  enableVisibility?: string;
  organizationId?: Product['organizationId'];
};

export type UpdateProductsSelections = {
  productId: Product['id'];
};

export type CreateProductsOptions = Partial<Product>;

export type UpdateProductsOptions = Partial<Product>;

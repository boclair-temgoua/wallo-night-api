import { PaginationType } from '../../app/utils/pagination';
import { Category } from '../../models/Category';

export type GetCategoriesSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Category['userId'];
  organizationId?: Category['organizationId'];
};

export type GetOneCategoriesSelections = {
  categoryId: Category['id'];
};

export type UpdateCategoriesSelections = {
  categoryId: Category['id'];
};

export type CreateCategoriesOptions = Partial<Category>;

export type UpdateCategoriesOptions = Partial<Category>;

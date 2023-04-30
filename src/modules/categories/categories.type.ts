import { Category } from '../../models/Category';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetCategoriesSelections = {
  search?: string;
  is_paginate: boolean;
  option1?: { organizationId: Category['organizationId'] };
  pagination?: PaginationType;
};

export type GetOneCategoriesSelections = {
  option1?: { categoryId: Category['id'] };
  option2?: {
    name: Category['name'];
    organizationId: Category['organizationId'];
  };
};

export type UpdateCategoriesSelections = {
  option1?: { categoryId: Category['id'] };
};

export type CreateCategoriesOptions = Partial<Category>;

export type UpdateCategoriesOptions = Partial<Category>;

import { Category } from '../../models/Category';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetCategoriesSelections = {
  search?: string;
  is_paginate: string;
  pagination?: PaginationType;
};

export type GetOneCategoriesSelections = {
  categoryId: Category['id'];
};

export type UpdateCategoriesSelections = {
  categoryId: Category['id'];
};

export type CreateCategoriesOptions = Partial<Category>;

export type UpdateCategoriesOptions = Partial<Category>;

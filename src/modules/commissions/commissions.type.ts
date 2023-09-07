import { Category } from '../../models/Category';
import { Commission } from '../../models/Commission';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetCommissionsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Commission['userId'];
};

export type GetOneCommissionsSelections = {
  commissionId?: Commission['id'];
  userId?: Commission['userId'];
};

export type UpdateCommissionsSelections = {
  commissionId: Commission['id'];
};

export type CreateCommissionsOptions = Partial<Commission>;

export type UpdateCommissionsOptions = Partial<Commission>;

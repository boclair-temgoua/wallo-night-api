import { PaginationType } from '../../app/utils/pagination';
import { Commission } from '../../models/Commission';

export type GetCommissionsSelections = {
  search?: string;
  status?: string;
  pagination?: PaginationType;
  userId?: Commission['userId'];
  organizationId?: Commission['organizationId'];
};

export type GetOneCommissionsSelections = {
  commissionId?: Commission['id'];
  userId?: Commission['userId'];
  organizationId?: Commission['organizationId'];
};

export type UpdateCommissionsSelections = {
  commissionId: Commission['id'];
};

export type CreateCommissionsOptions = Partial<Commission>;

export type UpdateCommissionsOptions = Partial<Commission>;

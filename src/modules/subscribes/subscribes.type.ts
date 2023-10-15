import { Subscribe } from '../../models/Subscribe';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetSubscribesSelections = {
  search?: string;
  userId?: Subscribe['userId'];
  subscriberId?: Subscribe['subscriberId'];
  organizationId?: Subscribe['organizationId'];
  pagination?: PaginationType;
};

export type GetOneSubscribeSelections = {
  subscribeId?: Subscribe['id'];
  userId?: Subscribe['userId'];
  organizationId?: Subscribe['organizationId'];
  subscriberId?: Subscribe['subscriberId'];
};

export type UpdateSubscribeSelections = {
  subscribeId: Subscribe['id'];
};

export type CreateSubscribeOptions = Partial<Subscribe>;

export type UpdateSubscribeOptions = Partial<Subscribe>;

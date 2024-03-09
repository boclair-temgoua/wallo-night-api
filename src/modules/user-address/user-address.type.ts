import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { UserAddress } from '../../models';

export type GetUserAddressSelections = {
  search?: string;
  userId?: UserAddress['userId'];
  organizationId?: UserAddress['userId'];
  pagination?: PaginationType;
};

export type GetOneUserAddressSelections = {
  userAddressId?: UserAddress['id'];
  userId?: UserAddress['userId'];
  organizationId?: UserAddress['userId'];
};

export type UpdateUserAddressSelections = {
  userAddressId: UserAddress['id'];
};

export type CreateUserAddressOptions = Partial<UserAddress>;

export type UpdateUserAddressOptions = Partial<UserAddress>;

import { UserAddress } from '../../models/UserAddress';

export type GetUserAddressSelections = {
  search?: string;
  option1?: {
    userId: UserAddress['userId'];
  };
  option2?: {
    organizationId: UserAddress['organizationId'];
  };
};

export type GetOneUserAddressSelections = {
  option1?: {
    userAddressId: UserAddress['id'];
  };
};

export type UpdateUserAddressSelections = {
  option1?: {
    userAddressId: UserAddress['id'];
  };
};

export type CreateUserAddressOptions = Partial<UserAddress>;

export type UpdateUserAddressOptions = Partial<UserAddress>;

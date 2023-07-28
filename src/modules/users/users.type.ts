import { User } from '../../models/User';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export enum StepRegister {
  EMAIL_CREATE = 'EMAIL_CREATE',
  USERNAME_CREATE = 'USERNAME_CREATE',
  CONFIRM_EMAIL = 'CONFIRM_EMAIL',
}

export type JwtPayloadType = {
  id: string;
  profileId: string;
  fullName: string;
  organizationInUtilizationId: string;
};

export type GetUsersSelections = {
  search?: string;
  pagination?: PaginationType;
};

export type GetOneUserSelections = {
  userId?: User['id'];
  email?: User['email'];
  token?: User['token'];
  username?: User['username'];
};

export type UpdateUserSelections = {
  userId?: User['id'];
  profileId?: User['profileId'];
};

export type CreateUserOptions = Partial<User>;

export type UpdateUserOptions = Partial<User>;

export type GetOnUserPublic = {
  id: string;
  confirmedAt: Date;
  email: string;
  profileId: string;
  organizationInUtilizationId: string;
  profile: {
    id: string;
    url: string;
    color: string;
    image: string;
    userId: string;
    countryId: string;
    fullName: string;
    currencyId: string;
  };
  organization: {
    id: string;
    name: string;
    color: string;
    userId: string;
  };
};

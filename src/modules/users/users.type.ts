import { User } from '../../models/User';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type NextStep =
  | 'CONFIRM_EMAIL'
  | 'SETTING_PROFILE'
  | 'SETTING_INTEREST'
  | 'COMPLETE_REGISTRATION';

export const nextStepArrays = [
  'CONFIRM_EMAIL',
  'SETTING_PROFILE',
  'SETTING_INTEREST',
  'COMPLETE_REGISTRATION',
];

export type JwtPayloadType = {
  id: string;
  profileId: string;
  organizationId: string;
};

export type GetUsersSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: ['userId'];
};

export type GetOneUserSelections = {
  userId?: User['id'];
  email?: User['email'];
  token?: User['token'];
  followerId?: User['id'];
  username?: User['username'];
  provider?: User['provider']
  organizationId?: User['organizationId'];
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
};

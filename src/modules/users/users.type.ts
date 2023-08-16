import { User } from '../../models/User';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export enum NextStep {
  CONFIRM_EMAIL = 'CONFIRM_EMAIL',
  SETTING_PROFILE = 'SETTING_PROFILE',
  SETTING_INTEREST = 'SETTING_INTEREST',
  COMPLETE_REGISTRATION = 'COMPLETE_REGISTRATION',
}

export type JwtPayloadType = {
  id: string;
  profileId: string;
};

export type GetUsersSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: ['userId']
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

import * as argon2 from 'argon2';
import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { User } from '../../models/User';

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
  provider?: User['provider'];
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

export const checkIfPasswordMatch = async (
  userPassword: string,
  password: string,
) => {
  return await argon2.verify(String(userPassword), String(password));
};

export const hashPassword = async (password: string) => {
  return await argon2.hash(String(password), {
    type: argon2.argon2id,
    saltLength: 32,
    memoryCost: 2 ** 16,
    parallelism: 4,
  });
};

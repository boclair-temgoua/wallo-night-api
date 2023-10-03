import { User } from '../../models/User';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type JwtPayloadType = {
  id: string;
  profileId: string;
  organizationId: string;
};

export type GetUsersSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: User['id'];
  organizationId?: User['organizationId'];
};

export type GetOneUserSelections = {
  userId?: User['id'];
  email?: User['email'];
  token?: User['token'];
  followerId?: User['id'];
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
  organizationId: string;
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

import { User } from '../../models/User';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type JwtPayloadType = {
  id: string;
  profileId: string;
  firstName: string;
  lastName: string;
  organizationInUtilizationId: string;
};

export type GetUsersSelections = {
  search?: string;
  pagination?: PaginationType;
};

export type GetOneUserSelections = {
  option1?: {
    userId: User['id'];
  };
  option2?: {
    email: User['email'];
  };
  option3?: {
    profileId: User['profileId'];
  };
  option5?: {
    token: User['token'];
  };
  option6?: {
    userId: User['id'];
    email: User['email'];
  };
};

export type UpdateUserSelections = {
  option1?: {
    userId: User['id'];
  };
  option2?: {
    email: User['email'];
  };
  option3?: {
    profileId: User['profileId'];
  };
};

export type CreateUserOptions = Partial<User>;

export type UpdateUserOptions = Partial<User>;

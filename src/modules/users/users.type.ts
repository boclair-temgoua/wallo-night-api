import { User } from '../../models/User';

export type JwtPayloadType = {
  id: string;
  profileId: string;
  firstName: string;
  lastName: string;
  organizationInUtilizationId: string;
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

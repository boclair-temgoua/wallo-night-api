import { Profile } from '../../models/Profile';

export type GetOneProfileSelections = {
  profileId: Profile['id'];
};

export type UpdateProfileSelections = {
  profileId: Profile['id'];
};

export type CreateProfileOptions = Partial<Profile>;

export type UpdateProfileOptions = Partial<Profile>;

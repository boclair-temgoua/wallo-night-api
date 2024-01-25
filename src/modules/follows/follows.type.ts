import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { Follow } from '../../models/Follow';

export type GetFollowsSelections = {
  search?: string;
  userId?: Follow['userId'];
  followerId?: Follow['followerId'];
  pagination?: PaginationType;
};

export type GetOneFollowSelections = {
  followId?: Follow['id'];
  userId?: Follow['userId'];
  followerId?: Follow['followerId'];
};

export type UpdateFollowSelections = {
  followId: Follow['id'];
};

export type CreateFollowOptions = Partial<Follow>;

export type UpdateFollowOptions = Partial<Follow>;

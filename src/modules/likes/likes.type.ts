import { Like } from '../../models/Like';

export type GetOneLikeSelections = {
  type: Like['type'];
  userId: Like['userId'];
  likeableId: Like['likeableId'];
};

export type UpdateLikeSelections = {
  likeId: Like['id'];
};

export type CreateLikeOptions = Partial<Like>;

export type UpdateLikeOptions = Partial<Like>;

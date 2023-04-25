import { Post } from '../../models/Post';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetPostsSelections = {
  search?: string;
  groupId: Post['groupId'];
  pagination?: PaginationType;
};

export type GetOnePostSelections = {
  slug?: Post['slug'];
  postId?: Post['id'];
};

export type UpdatePostSelections = {
  postId: Post['id'];
};

export type CreatePostOptions = Partial<Post>;

export type UpdatePostOptions = Partial<Post>;

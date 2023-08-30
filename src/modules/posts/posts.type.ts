import { Post } from '../../models/Post';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type PostType = 'AUDIO' | 'VIDEO' | 'ARTICLE' | 'GALLERY';

export const postTypeArrays = ['AUDIO', 'VIDEO', 'ARTICLE', 'GALLERY'];

export type GetPostsSelections = {
  search?: string;
  pagination?: PaginationType;
  type?: PostType;
  userId?: Post['userId'];
  followerIds?: string[];
};

export type GetOnePostSelections = {
  postId: Post['id'];
  type?: string;
  userId?: Post['userId'];
};

export type UpdatePostSelections = {
  postId: Post['id'];
};

export type CreatePostOptions = Partial<Post>;

export type UpdatePostOptions = Partial<Post>;

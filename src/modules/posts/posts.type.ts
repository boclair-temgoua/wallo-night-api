import { Post } from '../../models/Post';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export enum PostType {
  AUDIO = 'AUDIO',
  ARTICLE = 'ARTICLE',
  GALLERY = 'GALLERY',
}

export type GetPostsSelections = {
  search?: string;
  pagination?: PaginationType;
  type?: PostType;
  userId?: Post['userId'];
  followerIds?: string[];
};

export type GetOnePostSelections = {
  postId: Post['id'];
  userId?: Post['userId'];
};

export type UpdatePostSelections = {
  postId: Post['id'];
};

export type CreatePostOptions = Partial<Post>;

export type UpdatePostOptions = Partial<Post>;

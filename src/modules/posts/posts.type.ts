import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { Post } from '../../models/Post';

export type PostType = 'AUDIO' | 'VIDEO' | 'ARTICLE' | 'GALLERY';

export const postTypeArrays = ['AUDIO', 'VIDEO', 'ARTICLE', 'GALLERY'];

export type GetPostsSelections = {
  search?: string;
  pagination?: PaginationType;
  type?: PostType;
  status?: string;
  likeUserId?: Post['userId'];
  followerIds?: string[];
  typeIds?: [];
  albumId?: Post['albumId'];
  categoryId?: Post['categoryId'];
  organizationId?: Post['organizationId'];
};

export type GetOnePostSelections = {
  postId: Post['id'];
  type?: string;
  status?: string;
  postSlug?: string;
  likeUserId?: Post['userId'];
  organizationId?: Post['organizationId'];
};

export type UpdatePostSelections = {
  postId: Post['id'];
};

export type CreatePostOptions = Partial<Post>;

export type UpdatePostOptions = Partial<Post>;

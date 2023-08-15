import { PostCategory } from '../../models/PostCategory';

export type GetOnePostCategorySelections = {
  categoryId?: PostCategory['categoryId'];
  postId?: PostCategory['postId'];
};

export type UpdatePostCategorySelections = {
  categoryId?: PostCategory['categoryId'];
  postId?: PostCategory['postId'];
};

export type CreatePostCategoryOptions = Partial<PostCategory>;

export type UpdatePostCategoryOptions = Partial<PostCategory>;

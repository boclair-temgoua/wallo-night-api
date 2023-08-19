import { Comment } from '../../models/Comment';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetCommentsSelections = {
  search?: string;
  postId?: Comment['postId'];
  parentId?: Comment['parentId'];
  pagination?: PaginationType;
};

export type GetOneCommentSelections = {
  commentId?: Comment['id'];
  userId?: Comment['userId'];
};

export type UpdateCommentSelections = {
  commentId: Comment['id'];
};

export type CreateCommentOptions = Partial<Comment>;

export type UpdateCommentOptions = Partial<Comment>;

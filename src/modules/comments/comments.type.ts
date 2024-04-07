import { PaginationType } from '../../app/utils/pagination';
import { Comment } from '../../models/Comment';

export type GetCommentsSelections = {
  search?: string;
  likeUserId?: Comment['userId'];
  postId?: Comment['postId'];
  parentId?: Comment['parentId'];
  fkConversationId?: Comment['fkConversationId'];
  productId?: Comment['productId'];
  organizationId?: Comment['organizationId'];
  userReceiveId?: Comment['userReceiveId'];
  modelIds?: any[];
  pagination?: PaginationType;
};

export type GetOneCommentSelections = {
  organizationId?: Comment['organizationId'];
  commentId?: Comment['id'];
  userId?: Comment['userId'];
};

export type UpdateCommentSelections = {
  commentId: Comment['id'];
};

export type CreateCommentOptions = Partial<Comment>;

export type UpdateCommentOptions = Partial<Comment>;

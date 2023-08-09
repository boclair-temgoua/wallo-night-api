import { Article } from '../../models/Article';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export enum ArticleType {
  POST = 'POST',
  AUDIO = 'AUDIO',
  GALLERY = 'GALLERY',
}

export type GetArticlesSelections = {
  search?: string;
  pagination?: PaginationType;
  type?: ArticleType;
  userId?: Article['userId'];
};

export type GetOneArticleSelections = {
  articleId: Article['id'];
};

export type UpdateArticleSelections = {
  articleId: Article['id'];
};

export type CreateArticleOptions = Partial<Article>;

export type UpdateArticleOptions = Partial<Article>;

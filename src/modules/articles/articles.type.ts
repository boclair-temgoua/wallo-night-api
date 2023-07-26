import { Article } from '../../models/Article';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetArticlesSelections = {
  search?: string;
  pagination?: PaginationType;
};

export type GetOneArticleSelections = {
  articleId: Article['id'];
};

export type UpdateArticleSelections = {
  articleId: Article['id'];
};

export type CreateArticleOptions = Partial<Article>;

export type UpdateArticleOptions = Partial<Article>;

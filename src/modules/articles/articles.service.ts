import {
  withPagination,
  WithPaginationResponse,
} from '../../app/utils/pagination/with-pagination';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../../models/Article';
import { Brackets, Repository } from 'typeorm';
import {
  CreateArticleOptions,
  GetArticlesSelections,
  GetOneArticleSelections,
  UpdateArticleOptions,
  UpdateArticleSelections,
} from './articles.type';
import { useCatch } from '../../app/utils/use-catch';
import { generateNumber } from '../../app/utils/commons/generate-random';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private driver: Repository<Article>,
  ) {}

  async findAll(
    selections: GetArticlesSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination } = selections;

    let query = this.driver
      .createQueryBuilder('article')
      .select('article.title', 'title')
      .addSelect('article.status', 'status')
      .addSelect('article.id', 'id')
      .addSelect('article.slug', 'slug')
      .addSelect('article.image', 'image')
      .addSelect('article.createdAt', 'createdAt')
      .addSelect('article.description', 'description')
      .where('article.deletedAt IS NULL');

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('article.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('article.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Articles] = await useCatch(
      query
        .orderBy('article.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Articles,
    });
  }

  async findOneBy(selections: GetOneArticleSelections): Promise<Article> {
    const { articleId } = selections;
    let query = this.driver
      .createQueryBuilder('article')
      .select('article.title', 'title')
      .addSelect('article.status', 'status')
      .addSelect('article.id', 'id')
      .addSelect('article.slug', 'slug')
      .addSelect('article.image', 'image')
      .addSelect('article.createdAt', 'createdAt')
      .addSelect('article.description', 'description')
      .where('article.deletedAt IS NULL');

    if (articleId) {
      query = query.andWhere('article.id = :id', {
        id: articleId,
      });
    }
    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('article not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Article to the database. */
  async createOne(options: CreateArticleOptions): Promise<Article> {
    const { userId, status, title, description, image } = options;

    const article = new Article();
    article.userId = userId;
    article.title = title;
    article.slug = `${Slug(title)}-${generateNumber(4)}`;
    article.image = image;
    article.status = status;
    article.description = description;

    const query = this.driver.save(article);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Article to the database. */
  async updateOne(
    selections: UpdateArticleSelections,
    options: UpdateArticleOptions,
  ): Promise<Article> {
    const { articleId } = selections;
    const { title, status, description, image, deletedAt } = options;

    let findQuery = this.driver
      .createQueryBuilder('article')
      .where('article.deletedAt IS NULL');

    if (articleId) {
      findQuery = findQuery.andWhere('article.id = :id', { id: articleId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.description = description;
    findItem.image = image;
    findItem.status = status;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { getRandomElement } from '../../app/utils/array';
import { Slug, colorsArrays, generateNumber } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Category } from '../../models/Category';
import {
  CreateCategoriesOptions,
  GetCategoriesSelections,
  GetOneCategoriesSelections,
  UpdateCategoriesOptions,
  UpdateCategoriesSelections,
} from './categories.type';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private driver: Repository<Category>,
  ) {}

  async findAll(selections: GetCategoriesSelections): Promise<any> {
    const { search, pagination, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('category')
      .select('category.id', 'id')
      .addSelect('category.slug', 'slug')
      .addSelect('category.name', 'name')
      .addSelect('category.userId', 'userId')
      .addSelect('category.createdAt', 'createdAt')
      .addSelect('category.description', 'description')
      .addSelect('category.organizationId', 'organizationId')
      .where('category.deletedAt IS NULL');

    if (userId) {
      query = query.andWhere('category.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('category.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('category.name ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    if (pagination?.isPaginate === 'FALSE') {
      const [error, categories] = await useCatch(
        query.orderBy('category.createdAt', pagination?.sort).getRawMany(),
      );
      if (error) throw new NotFoundException(error);

      return categories;
    } else {
      const [error, categories] = await useCatch(
        query
          .orderBy('category.createdAt', pagination?.sort)
          .limit(pagination.limit)
          .offset(pagination.offset)
          .getRawMany(),
      );
      if (error) throw new NotFoundException(error);

      return withPagination({
        pagination,
        rowCount,
        value: categories,
      });
    }
  }

  async findOneBy(selections: GetOneCategoriesSelections): Promise<Category> {
    const { categoryId } = selections;
    let query = this.driver
      .createQueryBuilder('category')
      .where('category.deletedAt IS NULL');

    if (categoryId) {
      query = query.andWhere('category.id = :id', { id: categoryId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('category not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Categories to the database. */
  async createOne(options: CreateCategoriesOptions): Promise<Category> {
    const { name, description, organizationId, userId } = options;

    const category = new Category();
    category.name = name;
    category.organizationId = organizationId;
    category.color = getRandomElement(colorsArrays);
    category.slug = `${Slug(name)}-${generateNumber(4)}`;
    category.description = description;
    category.userId = userId;

    const query = this.driver.save(category);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Categories to the database. */
  async updateOne(
    selections: UpdateCategoriesSelections,
    options: UpdateCategoriesOptions,
  ): Promise<Category> {
    const { categoryId } = selections;
    const { name, description, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('category');

    if (categoryId) {
      findQuery = findQuery.where('category.id = :id', { id: categoryId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.name = name;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

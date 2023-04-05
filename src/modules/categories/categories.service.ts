import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../models/category';
import { Repository, Brackets } from 'typeorm';
import {
  CreateCategoriesOptions,
  GetCategoriesSelections,
  GetOneCategoriesSelections,
  UpdateCategoriesOptions,
  UpdateCategoriesSelections,
} from './categories.type';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { colorsArrays } from '../../app/utils/commons';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private driver: Repository<Category>,
  ) {}

  async findAll(selections: GetCategoriesSelections): Promise<any> {
    const { search, pagination, option1 } = selections;

    let query = this.driver
      .createQueryBuilder('category')
      .where('category.deletedAt IS NULL');

    if (option1) {
      const { organizationId } = option1;
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

    const [error, categories] = await useCatch(
      query
        .orderBy('category.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: categories,
    });
  }

  async findOneBy(selections: GetOneCategoriesSelections): Promise<Category> {
    const { option1, option2 } = selections;
    let query = this.driver
      .createQueryBuilder('category')
      .where('category.deletedAt IS NULL');

    if (option1) {
      const { categoryId } = option1;
      query = query.andWhere('category.id = :id', { id: categoryId });
    }

    if (option2) {
      const { organizationId, name } = option2;
      query = query
        .andWhere('category.name ::text ILIKE :search', {
          search: `%${name}%`,
        })
        .andWhere('category.organizationId = :organizationId', {
          organizationId,
        });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('category not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Categories to the database. */
  async createOne(options: CreateCategoriesOptions): Promise<Category> {
    const { name, description, userCreatedId, organizationId } = options;

    const category = new Category();
    category.name = name;
    category.color = getRandomElement(colorsArrays);
    category.description = description;
    category.userCreatedId = userCreatedId;
    category.organizationId = organizationId;

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
    const { option1 } = selections;
    const { name, description, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('category');

    if (option1) {
      findQuery = findQuery.where('category.id = :id', {
        id: option1.categoryId,
      });
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

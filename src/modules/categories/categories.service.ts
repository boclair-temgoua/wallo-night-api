import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../models/Category';
import { Repository, Brackets } from 'typeorm';
import {
  CreateCategoriesOptions,
  GetCategoriesSelections,
  GetOneCategoriesSelections,
  UpdateCategoriesOptions,
  UpdateCategoriesSelections,
} from './categories.type';
import * as Slug from 'slug';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { colorsArrays, generateNumber } from '../../app/utils/commons';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private driver: Repository<Category>,
  ) {}

  async findAll(selections: GetCategoriesSelections): Promise<any> {
    const { search, pagination, is_paginate, option1 } = selections;

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

    if (is_paginate) {
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
    } else {
      const [errors, results] = await useCatch(
        query.orderBy('category.createdAt', 'DESC').getMany(),
      );
      if (errors) throw new NotFoundException(errors);

      return results;
    }
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
    category.slug = `${Slug(name)}-${generateNumber(4)}`;
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

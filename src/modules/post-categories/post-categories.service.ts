import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Repository } from 'typeorm';
import {
  GetOnePostCategorySelections,
  CreatePostCategoryOptions,
  UpdatePostCategorySelections,
} from './post-categories.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';
import { PostCategory } from '../../models/PostCategory';

@Injectable()
export class PostCategoriesService {
  constructor(
    @InjectRepository(PostCategory)
    private driver: Repository<PostCategory>,
  ) {}

  async findOneBy(
    selections: GetOnePostCategorySelections,
  ): Promise<PostCategory> {
    const { postId, categoryId } = selections;
    let query = this.driver.createQueryBuilder('postCategory');

    if (categoryId) {
      query = query.where('postCategory.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (postId) {
      query = query.where('postCategory.postId = :postId', { postId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('postCategory not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one PostCategory to the database. */
  async createOne(
    selections: CreatePostCategoryOptions,
  ): Promise<PostCategory> {
    const { postId, categoryId } = selections;

    const postCategory = new PostCategory();
    postCategory.postId = postId;
    postCategory.categoryId = categoryId;
    const query = this.driver.save(postCategory);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Delete one PostCategory to the database. */
  async deleteOne(selections: GetOnePostCategorySelections): Promise<any> {
    const { categoryId, postId } = selections;

    let findQuery = this.driver.createQueryBuilder('postCategory');

    if (categoryId) {
      findQuery = findQuery.where('postCategory.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (postId) {
      findQuery = findQuery.where('postCategory.postId = :postId', { postId });
    }

    findQuery.delete().from(PostCategory).execute();

    return findQuery;
  }
}

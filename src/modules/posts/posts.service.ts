import { withPagination } from '../../app/utils/pagination/with-pagination';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../models/Post';
import { Repository } from 'typeorm';
import {
  CreatePostOptions,
  GetPostsSelections,
  GetOnePostSelections,
  UpdatePostOptions,
  UpdatePostSelections,
} from './posts.type';
import { useCatch } from '../../app/utils/use-catch';
import { generateNumber } from '../../app/utils/commons/generate-random';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private driver: Repository<Post>,
  ) {}

  async findAll(selections: GetPostsSelections): Promise<any> {
    const { search, pagination, groupId } = selections;

    let query = this.driver
      .createQueryBuilder('post')
      .select('post.title', 'title')
      .addSelect('post.id', 'id')
      .addSelect('post.slug', 'slug')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.description', 'description')
      .addSelect('post.groupId', 'groupId')
      .addSelect(
        /*sql*/ `(
    SELECT
        CAST(COUNT(DISTINCT com) AS INT)
    FROM "comment" "com"
    WHERE ("com"."postId" = "post"."id"
    AND "com"."deletedAt" IS NULL)
    GROUP BY "com"."postId", "post"."id"
    ) AS "commentTotal"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'image', "profile"."image",
          'color', "profile"."color",
          'userId', "user"."id",
          'email', "user"."email"
      ) AS "profile"`,
      )
      .where('post.deletedAt IS NULL');

    if (groupId) {
      query = query.andWhere('post.groupId = :groupId', { groupId });
    }

    if (search) {
      query = query.andWhere('post.title ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    query = query
      .leftJoin('post.group', 'group')
      .leftJoin('post.user', 'user')
      .leftJoin('user.profile', 'profile');

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, posts] = await useCatch(
      query
        .orderBy('post.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: posts,
    });
  }

  async findOneBy(selections: GetOnePostSelections): Promise<Post> {
    const { postId, slug } = selections;
    let query = this.driver
      .createQueryBuilder('post')
      .select('post.title', 'title')
      .addSelect('post.id', 'id')
      .addSelect('post.slug', 'slug')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.description', 'description')
      .addSelect('post.groupId', 'groupId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT com) AS INT)
      FROM "comment" "com"
      WHERE ("com"."postId" = "post"."id"
      AND "com"."deletedAt" IS NULL)
      GROUP BY "com"."postId", "post"."id"
      ) AS "commentTotal"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
            'firstName', "profile"."firstName",
            'lastName', "profile"."lastName",
            'image', "profile"."image",
            'color', "profile"."color",
            'userId', "user"."id",
            'email', "user"."email"
        ) AS "profile"`,
      )
      .where('post.deletedAt IS NULL');

    if (postId) {
      query = query.andWhere('post.id = :id', {
        id: postId,
      });
    }

    if (slug) {
      query = query.andWhere('post.slug = :slug', { slug });
    }

    query = query
      .leftJoin('post.group', 'group')
      .leftJoin('post.user', 'user')
      .leftJoin('user.profile', 'profile');

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Post to the database. */
  async createOne(options: CreatePostOptions): Promise<Post> {
    const { title, description, groupId, userId } = options;

    const post = new Post();
    post.title = title;
    post.slug = `${Slug(title)}-${generateNumber(4)}`;
    post.groupId = groupId;
    post.userId = userId;
    post.description = description;

    const query = this.driver.save(post);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Post to the database. */
  async updateOne(
    selections: UpdatePostSelections,
    options: UpdatePostOptions,
  ): Promise<Post> {
    const { postId } = selections;
    const { title, description, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('Post');

    if (postId) {
      findQuery = findQuery.where('post.id = :id', {
        id: postId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

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
import { Post } from '../../models/Post';
import { Brackets, Repository } from 'typeorm';
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

  async findAllFollow(
    selections: GetPostsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, followerIds, type } = selections;

    let query = this.driver
      .createQueryBuilder('post')
      .select('post.title', 'title')
      .addSelect('post.status', 'status')
      .addSelect('post.id', 'id')
      .addSelect('post.slug', 'slug')
      .addSelect('post.image', 'image')
      .addSelect('post.allowDownload', 'allowDownload')
      .addSelect('post.type', 'type')
      .addSelect('post.whoCanSee', 'whoCanSee')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect('post.description', 'description')
      .where('post.deletedAt IS NULL')
      .andWhere('post.userId IN (:...followerIds)', {
        followerIds,
      })
      .leftJoin('post.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (type) {
      query = query.andWhere('post.type = :type', { type });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('post.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

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

  async findAll(
    selections: GetPostsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, type } = selections;

    let query = this.driver
      .createQueryBuilder('post')
      .select('post.title', 'title')
      .addSelect('post.status', 'status')
      .addSelect('post.id', 'id')
      .addSelect('post.slug', 'slug')
      .addSelect('post.image', 'image')
      .addSelect('post.allowDownload', 'allowDownload')
      .addSelect('post.type', 'type')
      .addSelect('post.whoCanSee', 'whoCanSee')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect('post.description', 'description')
      .where('post.deletedAt IS NULL')
      .leftJoin('post.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (userId) {
      query = query.andWhere('post.userId = :userId', { userId });
    }

    if (type) {
      query = query.andWhere('post.type = :type', { type });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('post.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

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
    const { postId } = selections;
    let query = this.driver
      .createQueryBuilder('post')
      .select('post.title', 'title')
      .addSelect('post.status', 'status')
      .addSelect('post.id', 'id')
      .addSelect('post.slug', 'slug')
      .addSelect('post.image', 'image')
      .addSelect('post.allowDownload', 'allowDownload')
      .addSelect('post.type', 'type')
      .addSelect('post.whoCanSee', 'whoCanSee')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
            'fullName', "profile"."fullName",
            'image', "profile"."image",
            'color', "profile"."color",
            'userId', "user"."id",
            'email', "user"."email"
        ) AS "profile"`,
      )

      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'id', "ctg"."id",
            'name', "ctg"."name"
          )) 
          FROM "post_category" "potctg"
          LEFT JOIN "category" "ctg" On "potctg"."categoryId" = "ctg"."id"
          WHERE "potctg"."postId" = "post"."id"
          AND "ctg"."deletedAt" IS NULL
          GROUP BY "post"."id", "potctg"."postId"
          ) AS "categories"`,
      )
      .addSelect('post.description', 'description')
      .where('post.deletedAt IS NULL')
      .leftJoin('post.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (postId) {
      query = query.andWhere('post.id = :id', {
        id: postId,
      });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one post to the database. */
  async createOne(options: CreatePostOptions): Promise<Post> {
    const {
      userId,
      status,
      title,
      type,
      image,
      whoCanSee,
      allowDownload,
      description,
    } = options;

    const post = new Post();
    post.userId = userId;
    post.title = title;
    post.type = type;
    post.whoCanSee = whoCanSee;
    post.allowDownload = allowDownload;
    post.slug = `${Slug(title)}-${generateNumber(4)}`;
    post.image = image;
    post.status = status;
    post.description = description;

    const query = this.driver.save(post);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one post to the database. */
  async updateOne(
    selections: UpdatePostSelections,
    options: UpdatePostOptions,
  ): Promise<Post> {
    const { postId } = selections;
    const {
      title,
      status,
      type,
      whoCanSee,
      allowDownload,
      description,
      image,
      deletedAt,
    } = options;

    let findQuery = this.driver
      .createQueryBuilder('post')
      .where('post.deletedAt IS NULL');

    if (postId) {
      findQuery = findQuery.andWhere('post.id = :id', { id: postId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.description = description;
    findItem.image = image;
    findItem.status = status;
    findItem.type = type;
    findItem.whoCanSee = whoCanSee;
    findItem.allowDownload = allowDownload;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

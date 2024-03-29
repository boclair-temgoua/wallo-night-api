import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  generateLongUUID,
  generateNumber,
  Slug,
} from '../../app/utils/commons/generate-random';
import {
  withPagination,
  WithPaginationResponse,
} from '../../app/utils/pagination/with-pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Post } from '../../models/Post';
import {
  CreatePostOptions,
  GetOnePostSelections,
  GetPostsSelections,
  UpdatePostOptions,
  UpdatePostSelections,
} from './posts.type';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private driver: Repository<Post>,
  ) {}

  async findAll(
    selections: GetPostsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, type, status } = selections;

    let query = this.driver
      .createQueryBuilder('post')
      .select('post.title', 'title')
      .addSelect('post.status', 'status')
      .addSelect('post.id', 'id')
      .addSelect('post.slug', 'slug')
      .addSelect('post.allowDownload', 'allowDownload')
      .addSelect('post.userId', 'userId')
      .addSelect('post.type', 'type')
      .addSelect('post.urlMedia', 'urlMedia')
      .addSelect('post.enableUrlMedia', 'enableUrlMedia')
      .addSelect('post.whoCanSee', 'whoCanSee')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'username', "user"."username"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT com) AS INT)
        FROM "comment" "com"
        WHERE ("com"."postId" = "post"."id"
         AND "com"."deletedAt" IS NULL)
         GROUP BY "com"."postId", "post"."id"
        ) AS "totalComment"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "post"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('POST')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "post"."id", "upl"."uploadableId"
          ) AS "uploadsImage"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "post"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('POST')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "post"."id", "upl"."uploadableId"
          ) AS "uploadsFile"`,
      )
      .addSelect('post.description', 'description')
      .where('post.deletedAt IS NULL')
      .leftJoin('post.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (userId) {
      query = query.andWhere('post.userId = :userId', { userId });
    }

    if (status) {
      query = query.andWhere('post.status = :status', { status });
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
    const { postId, userId, postSlug, likeUserId, type, status } = selections;
    let query = this.driver
      .createQueryBuilder('post')
      .select('post.title', 'title')
      .addSelect('post.status', 'status')
      .addSelect('post.id', 'id')
      .addSelect('post.slug', 'slug')
      .addSelect('post.allowDownload', 'allowDownload')
      .addSelect('post.userId', 'userId')
      .addSelect('post.type', 'type')
      .addSelect('post.urlMedia', 'urlMedia')
      .addSelect('post.enableUrlMedia', 'enableUrlMedia')
      .addSelect('post.whoCanSee', 'whoCanSee')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
            'firstName', "profile"."firstName",
            'lastName', "profile"."lastName",
            'fullName', "profile"."fullName",
            'image', "profile"."image",
            'color', "profile"."color",
            'userId', "user"."id",
            'username', "user"."username"
        ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT com) AS INT)
        FROM "comment" "com"
        WHERE ("com"."postId" = "post"."id"
         AND "com"."deletedAt" IS NULL)
         GROUP BY "com"."postId", "post"."id"
        ) AS "totalComment"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'id', "upl"."id",
            'name', "upl"."name",
            'path', "upl"."path",
            'status', "upl"."status",
            'url', "upl"."url",
            'userId', "upl"."userId",
            'model', "upl"."model",
            'uploadType', "upl"."uploadType",
            'uploadableId', "upl"."uploadableId"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "post"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('POST')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "post"."id", "upl"."uploadableId"
          ) AS "uploadsImage"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'id', "upl"."id",
            'name', "upl"."name",
            'path', "upl"."path",
            'status', "upl"."status",
            'url', "upl"."url",
            'userId', "upl"."userId",
            'model', "upl"."model",
            'uploadType', "upl"."uploadType",
            'uploadableId', "upl"."uploadableId"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "post"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('POST')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "post"."id", "upl"."uploadableId"
          ) AS "uploadsFile"`,
      )
      .addSelect('post.description', 'description')
      .where('post.deletedAt IS NULL')
      .leftJoin('post.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (status) {
      query = query.andWhere('post.status = :status', { status });
    }

    if (userId) {
      query = query.andWhere('post.userId = :userId', { userId });
    }

    if (type) {
      query = query.andWhere('post.type = :type', { type });
    }

    if (postId) {
      query = query.andWhere('post.id = :id', {
        id: postId,
      });
    }

    if (postSlug) {
      query = query.andWhere('post.slug = :slug', { slug: postSlug });
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
      urlMedia,
      whoCanSee,
      enableUrlMedia,
      allowDownload,
      description,
    } = options;

    const post = new Post();
    post.userId = userId;
    post.title = title;
    post.type = type;
    post.urlMedia = urlMedia;
    post.whoCanSee = whoCanSee;
    post.allowDownload = allowDownload;
    post.enableUrlMedia = enableUrlMedia;
    post.slug = `${
      title ? `${Slug(title)}-${generateNumber(4)}` : generateLongUUID(10)
    }`;
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
      enableUrlMedia,
      description,
      urlMedia,
      deletedAt,
    } = options;

    let findQuery = this.driver
      .createQueryBuilder('post')
      .where('post.deletedAt IS NULL');

    if (postId) {
      findQuery = findQuery.andWhere('post.id = :id', { id: postId });
    }

    const [errorFind, post] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    post.title = title;
    post.type = type;
    post.urlMedia = urlMedia;
    post.whoCanSee = whoCanSee;
    post.allowDownload = allowDownload;
    post.status = status;
    post.description = description;
    post.enableUrlMedia = enableUrlMedia;
    post.deletedAt = deletedAt;

    const query = this.driver.save(post);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

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
import {
  generateLongUUID,
  generateNumber,
} from '../../app/utils/commons/generate-random';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private driver: Repository<Post>,
  ) {}

  async findAll(
    selections: GetPostsSelections,
  ): Promise<WithPaginationResponse | null> {
    const {
      search,
      pagination,
      type,
      status,
      likeUserId,
      followerIds,
      typeIds,
      organizationId,
    } = selections;

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
      .addSelect('post.organizationId', 'organizationId')
      .addSelect('post.whoCanSee', 'whoCanSee')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'description', "profile"."description",
              'userId', "user"."id",
              'username', "user"."username"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT lik) AS INT)
        FROM "like" "lik"
        WHERE ("lik"."likeableId" = "post"."id"
         AND "lik"."type" IN ('POST')
         AND "lik"."deletedAt" IS NULL)
         GROUP BY "lik"."likeableId", "lik"."type", "post"."id"
        ) AS "totalLike"`,
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
      .leftJoin('post.organization', 'organization')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (likeUserId) {
      query = query.addSelect(/*sql*/ `(
              SELECT
                  CAST(COUNT(DISTINCT lk) AS INT)
              FROM "like" "lk"
              WHERE ("lk"."type" IN ('POST')
               AND "lk"."deletedAt" IS NULL
               AND "lk"."likeableId" = "post"."id"
               AND "lk"."userId" IN ('${likeUserId}'))
              ) AS "isLike"`).addSelect(/*sql*/ `(
                SELECT
                    CAST(COUNT(DISTINCT sub) AS INT)
                FROM "subscribe" "sub"
                WHERE ("sub"."subscriberId" = "post"."userId"
                 AND "sub"."expiredAt" >= now()::date
                 AND "sub"."userId" IN ('${likeUserId}')
                 AND "sub"."deletedAt" IS NULL)
                ) AS "isValidSubscribe"`);
    } else {
      query = query.addSelect(/*sql*/ `null`, 'isValidSubscribe');
    }

    if (followerIds && followerIds.length > 0) {
      query = query.andWhere('post.userId IN (:...followerIds)', {
        followerIds,
      });
    }

    if (typeIds && typeIds.length > 0) {
      query = query.andWhere('post.type IN (:...typeIds)', { typeIds });
    }

    if (organizationId) {
      query = query.andWhere('post.organizationId = :organizationId', {
        organizationId,
      });
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
    const { postId, organizationId, postSlug, likeUserId, type, status } =
      selections;
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
      .addSelect('post.organizationId', 'organizationId')
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
            'description', "profile"."description",
            'username', "user"."username"
        ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT lik) AS INT)
        FROM "like" "lik"
        WHERE ("lik"."likeableId" = "post"."id"
         AND "lik"."type" IN ('POST')
         AND "lik"."deletedAt" IS NULL)
         GROUP BY "lik"."likeableId", "lik"."type", "post"."id"
        ) AS "totalLike"`,
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
      .leftJoin('post.organization', 'organization')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (likeUserId) {
      query = query.addSelect(/*sql*/ `(
              SELECT
                  CAST(COUNT(DISTINCT lk) AS INT)
              FROM "like" "lk"
              WHERE ("lk"."type" IN ('POST')
               AND "lk"."deletedAt" IS NULL
               AND "lk"."likeableId" = "post"."id"
               AND "lk"."userId" IN ('${likeUserId}'))
               GROUP BY "lk"."likeableId", "post"."id"
              ) AS "isLike"`).addSelect(/*sql*/ `(
                SELECT
                    CAST(COUNT(DISTINCT sub) AS INT)
                FROM "subscribe" "sub"
                WHERE ("sub"."subscriberId" = "user"."id"
                 AND "sub"."expiredAt" >= now()::date
                 AND "sub"."userId" IN ('${likeUserId}')
                 AND "sub"."deletedAt" IS NULL)
                ) AS "isValidSubscribe"`);
    }

    if (status) {
      query = query.andWhere('post.status = :status', { status });
    }

    if (organizationId) {
      query = query.andWhere('post.organizationId = :organizationId', {
        organizationId,
      });
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
      organizationId,
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
    post.organizationId = organizationId;
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

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { withPagination } from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Comment } from '../../models/Comment';
import {
  CreateCommentOptions,
  GetCommentsSelections,
  GetOneCommentSelections,
  UpdateCommentOptions,
  UpdateCommentSelections,
} from './comments.type';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private driver: Repository<Comment>,
  ) {}

  async findAll(selections: GetCommentsSelections): Promise<any> {
    const {
      search,
      pagination,
      postId,
      parentId,
      productId,
      userReceiveId,
      modelIds,
      likeUserId,
      organizationId,
      fkConversationId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('comment')
      .select('comment.id', 'id')
      .addSelect('comment.createdAt', 'createdAt')
      .addSelect('comment.description', 'description')
      .addSelect('comment.postId', 'postId')
      .addSelect('comment.productId', 'productId')
      .addSelect('comment.userId', 'userId')
      .addSelect('comment.parentId', 'parentId')
      .addSelect('comment.model', 'model')
      .addSelect('comment.color', 'color')
      .addSelect('comment.email', 'email')
      .addSelect('comment.fullName', 'fullName')
      .addSelect('comment.organizationId', 'organizationId')
      .addSelect('comment.userReceiveId', 'userReceiveId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'username', "user"."username",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT lik) AS INT)
        FROM "like" "lik"
        WHERE ("lik"."likeableId" = "comment"."id"
         AND "lik"."type" IN ('COMMENT')
         AND "lik"."deletedAt" IS NULL)
         GROUP BY "lik"."likeableId", "lik"."type", "comment"."id"
        ) AS "totalLike"`,
      )
      .where('comment.deletedAt IS NULL');

    if (likeUserId) {
      query = query.addSelect(/*sql*/ `(
                SELECT
                    CAST(COUNT(DISTINCT lk) AS INT)
                FROM "like" "lk"
                WHERE ("lk"."type" IN ('COMMENT')
                 AND "lk"."deletedAt" IS NULL
                 AND "lk"."likeableId" = "comment"."id"
                 AND "lk"."userId" IN ('${likeUserId}'))
                 GROUP BY "lk"."likeableId", "comment"."id"
                ) AS "isLike"`);
    }

    if (fkConversationId) {
      query = query.andWhere('comment.fkConversationId = :fkConversationId', {
        fkConversationId,
      });
    }

    if (organizationId) {
      query = query.andWhere('comment.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (postId) {
      query = query.andWhere('comment.postId = :postId', { postId });
    }

    if (userReceiveId) {
      query = query.andWhere('comment.userReceiveId = :userReceiveId', {
        userReceiveId,
      });
    }

    if (modelIds && modelIds.length > 0) {
      query = query.andWhere('comment.model IN (:...modelIds)', { modelIds });
    }

    if (productId) {
      query = query.andWhere('comment.productId = :productId', { productId });
    }

    if (parentId) {
      query = query
        .andWhere('comment.parentId IS NOT NULL')
        .andWhere('comment.parentId = :parentId', { parentId });
    } else {
      query = query.andWhere('comment.parentId IS NULL');
    }

    if (search) {
      query = query.andWhere('comment.description ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    query = query
      .leftJoin('comment.post', 'post')
      .leftJoin('comment.user', 'user')
      .leftJoin('user.profile', 'profile');

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, comments] = await useCatch(
      query
        .orderBy('comment.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: comments,
    });
  }

  async findAllMessages(selections: GetCommentsSelections): Promise<any> {
    const { modelIds, pagination, organizationId, fkConversationId } =
      selections;

    let query = this.driver
      .createQueryBuilder('comment')
      .select('comment.id', 'id')
      .addSelect('comment.createdAt', 'createdAt')
      .addSelect('comment.description', 'description')
      .addSelect('comment.model', 'model')
      .addSelect('comment.color', 'color')
      .addSelect('comment.organizationId', 'organizationId')
      .addSelect('comment.fkConversationId', 'fkConversationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'username', "user"."username",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT lik) AS INT)
        FROM "like" "lik"
        WHERE ("lik"."likeableId" = "comment"."id"
         AND "lik"."type" IN ('COMMENT')
         AND "lik"."deletedAt" IS NULL)
         GROUP BY "lik"."likeableId", "lik"."type", "comment"."id"
        ) AS "totalLike"`,
      )
      .where('comment.deletedAt IS NULL');

    if (fkConversationId) {
      query = query.andWhere('comment.fkConversationId = :fkConversationId', {
        fkConversationId,
      });
    }

    if (modelIds && modelIds.length > 0) {
      query = query.andWhere('comment.model IN (:...modelIds)', { modelIds });
    }

    if (organizationId) {
      query = query.andWhere('comment.organizationId = :organizationId', {
        organizationId,
      });
    }

    query = query
      .leftJoin('comment.organization', 'organization')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile');

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, comments] = await useCatch(
      query
        .orderBy('comment.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: comments,
    });
  }

  async findOneBy(selections: GetOneCommentSelections): Promise<Comment> {
    const { commentId, userId, organizationId } = selections;
    let query = this.driver
      .createQueryBuilder('comment')
      .where('comment.deletedAt IS NULL');

    if (commentId) {
      query = query.andWhere('comment.id = :id', {
        id: commentId,
      });
    }

    if (organizationId) {
      query = query.andWhere('comment.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (userId) {
      query = query.andWhere('comment.userId = :userId', { userId });
    }
    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Comment to the database. */
  async createOne(options: CreateCommentOptions): Promise<Comment> {
    const {
      description,
      postId,
      productId,
      parentId,
      model,
      userId,
      color,
      email,
      fullName,
      organizationId,
      userReceiveId,
      fkConversationId,
    } = options;

    const comment = new Comment();
    comment.postId = postId;
    comment.userId = userId;
    comment.parentId = parentId;
    comment.model = model;
    comment.color = color;
    comment.email = email;
    comment.fullName = fullName;
    comment.productId = productId;
    comment.description = description;
    comment.organizationId = organizationId;
    comment.fkConversationId = fkConversationId;
    comment.userReceiveId = userReceiveId;

    const query = this.driver.save(comment);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Comment to the database. */
  async updateOne(
    selections: UpdateCommentSelections,
    options: UpdateCommentOptions,
  ): Promise<Comment> {
    const { commentId } = selections;
    const { description, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('comment');

    if (commentId) {
      findQuery = findQuery.where('comment.id = :id', {
        id: commentId,
      });
    }

    const [errorFind, comment] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    comment.description = description;
    comment.deletedAt = deletedAt;

    const query = this.driver.save(comment);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

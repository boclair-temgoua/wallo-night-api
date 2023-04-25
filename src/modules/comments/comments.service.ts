import { withPagination } from '../../app/utils/pagination/with-pagination';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../models/Comment';
import { Repository } from 'typeorm';
import {
  CreateCommentOptions,
  GetCommentsSelections,
  GetOneCommentSelections,
  UpdateCommentOptions,
  UpdateCommentSelections,
} from './comments.type';
import { useCatch } from '../../app/utils/use-catch';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private driver: Repository<Comment>,
  ) {}

  async findAll(selections: GetCommentsSelections): Promise<any> {
    const { search, pagination, postId, documentId } = selections;

    let query = this.driver
      .createQueryBuilder('comment')
      .select('comment.id', 'id')
      .addSelect('comment.createdAt', 'createdAt')
      .addSelect('comment.description', 'description')
      .addSelect('comment.documentId', 'documentId')
      .addSelect('comment.postId', 'postId')
      .addSelect('comment.userId', 'userId')
      .where('comment.deletedAt IS NULL')
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
      .where('comment.deletedAt IS NULL');

    if (postId) {
      query = query.andWhere('comment.postId = :postId', { postId });
    }

    if (documentId) {
      query = query.andWhere('comment.documentId = :documentId', {
        documentId,
      });
    }
    if (search) {
      query = query.andWhere('comment.title ::text ILIKE :search', {
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

  async findOneBy(selections: GetOneCommentSelections): Promise<Comment> {
    const { commentId, userId } = selections;
    let query = this.driver
      .createQueryBuilder('comment')
      .where('comment.deletedAt IS NULL');

    if (commentId) {
      query = query.andWhere('comment.id = :id', {
        id: commentId,
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
    const { description, documentId, postId, userId } = options;

    const comment = new Comment();
    comment.postId = postId;
    comment.userId = userId;
    comment.documentId = documentId;
    comment.description = description;

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

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

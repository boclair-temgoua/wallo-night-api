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
import { Follow } from '../../models/Follow';
import { Brackets, Repository } from 'typeorm';
import {
  CreateFollowOptions,
  GetFollowsSelections,
  GetOneFollowSelections,
  UpdateFollowOptions,
  UpdateFollowSelections,
} from './follows.type';
import { useCatch } from '../../app/utils/use-catch';
import { generateNumber } from '../../app/utils/commons/generate-random';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private driver: Repository<Follow>,
  ) {}

  async findAll(
    selections: GetFollowsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId } = selections;

    let query = this.driver
      .createQueryBuilder('follow')
      .select('follow.followerId', 'followerId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'firstName', "profile"."firstName",
        'lastName', "profile"."lastName",
        'fullName', "profile"."fullName",
        'image', "profile"."image",
        'color', "profile"."color",
        'userId', "follower"."id",
        'email', "follower"."email"
    ) AS "profile"`,
      )
      .where('follow.deletedAt IS NULL')
      .leftJoin('follow.follower', 'follower')
      .leftJoin('follower.profile', 'profile');

    if (userId) {
      query = query.andWhere('follow.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('follower.email ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('profile.firstName ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('profile.lastName ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('profile.fullName ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, follows] = await useCatch(
      query
        .orderBy('follow.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: follows,
    });
  }

  async findOneBy(selections: GetOneFollowSelections): Promise<Follow> {
    const { followId, followerId, userId } = selections;
    let query = this.driver
      .createQueryBuilder('follow')
      .where('follow.deletedAt IS NULL');

    if (userId) {
      query = query.andWhere('follow.userId = :userId', { userId });
    }

    if (followerId) {
      query = query.andWhere('follow.followerId = :followerId', { followerId });
    }

    if (followId) {
      query = query.andWhere('follow.id = :id', {
        id: followId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('follow not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Follow to the database. */
  async createOne(options: CreateFollowOptions): Promise<Follow> {
    const { userId, followerId } = options;

    const follow = new Follow();
    follow.userId = userId;
    follow.followerId = followerId;

    const query = this.driver.save(follow);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Follow to the database. */
  async updateOne(
    selections: UpdateFollowSelections,
    options: UpdateFollowOptions,
  ): Promise<Follow> {
    const { followId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('follow');

    if (followId) {
      findQuery = findQuery.where('follow.id = :id', { id: followId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

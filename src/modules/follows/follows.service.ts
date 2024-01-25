import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  withPagination,
  WithPaginationResponse,
} from '../../app/utils/pagination/with-pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Follow } from '../../models/Follow';
import {
  CreateFollowOptions,
  GetFollowsSelections,
  GetOneFollowSelections,
  UpdateFollowOptions,
  UpdateFollowSelections,
} from './follows.type';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private driver: Repository<Follow>,
  ) {}

  async findAll(
    selections: GetFollowsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, followerId } = selections;

    let query = this.driver
      .createQueryBuilder('follow')
      .select('follow.followerId', 'followerId')
      .addSelect('follow.createdAt', 'createdAt')
      .where('follow.deletedAt IS NULL')
      .leftJoin('follow.follower', 'follower')
      .leftJoin('follower.profile', 'profileFollowing')
      .leftJoin('follow.user', 'user')
      .leftJoin('user.profile', 'profileFollower');

    if (userId) {
      query = query
        .addSelect(
          /*sql*/ `jsonb_build_object(
        'firstName', "profileFollowing"."firstName",
        'lastName', "profileFollowing"."lastName",
        'fullName', "profileFollowing"."fullName",
        'image', "profileFollowing"."image",
        'color', "profileFollowing"."color",
        'userId', "follower"."id",
        'username', "follower"."username"
    ) AS "profile"`,
        )
        .andWhere('follow.userId = :userId', { userId });
    }

    if (followerId) {
      query = query
        .addSelect(
          /*sql*/ `jsonb_build_object(
        'firstName', "profileFollower"."firstName",
        'lastName', "profileFollower"."lastName",
        'fullName', "profileFollower"."fullName",
        'image', "profileFollower"."image",
        'color', "profileFollower"."color",
        'userId', "user"."id",
        'username', "user"."username"
    ) AS "profile"`,
        )
        .andWhere('follow.followerId = :followerId', { followerId });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('follower.email ::text ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('profileFollower.firstName ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('profileFollower.lastName ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('profileFollower.fullName ::text ILIKE :search', {
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

  async findAllNotPaginate(selections: GetFollowsSelections): Promise<any> {
    const { userId, followerId } = selections;

    let query = this.driver
      .createQueryBuilder('follow')
      .select('follow.followerId', 'followerId')
      .addSelect('follow.userId', 'userId')
      .where('follow.deletedAt IS NULL');

    if (userId) {
      query = query.andWhere('follow.userId = :userId', { userId });
    }

    if (followerId) {
      query = query.andWhere('follow.followerId = :followerId', { followerId });
    }

    const [error, follows] = await useCatch(query.getRawMany());
    if (error) throw new NotFoundException(error);

    return follows;
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

    const [errorFind, follow] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    follow.deletedAt = deletedAt;

    const query = this.driver.save(follow);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

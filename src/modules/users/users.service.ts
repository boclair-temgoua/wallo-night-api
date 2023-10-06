import { Contributor } from './../../models/Contributor';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { Brackets, Repository } from 'typeorm';
import {
  CreateUserOptions,
  GetOneUserSelections,
  GetOnUserPublic,
  GetUsersSelections,
  UpdateUserOptions,
  UpdateUserSelections,
} from './users.type';
import { useCatch } from '../../app/utils/use-catch';
import { generateLongUUID } from '../../app/utils/commons/generate-random';
import { withPagination } from '../../app/utils/pagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private driver: Repository<User>,
  ) {}

  async findAll(selections: GetUsersSelections): Promise<any> {
    const { search, pagination, userId } = selections;
    let query = this.driver
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.confirmedAt', 'confirmedAt')
      .addSelect('user.profileId', 'profileId')
      .addSelect('user.createdAt', 'createdAt')
      .addSelect('user.nextStep', 'nextStep')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'fullName', "profile"."fullName",
          'enableShop', "profile"."enableShop",
          'enableGallery', "profile"."enableGallery",
          'enableCommission', "profile"."enableCommission",
          'image', "profile"."image",
          'color', "profile"."color",
          'countryId', "profile"."countryId",
          'url', "profile"."url"
      ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'name', "con"."role"
        )
        FROM "contributor" "con"
        WHERE "user"."id" = "con"."userId"
        AND "con"."type" IN ('ORGANIZATION')
        ) AS "role"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile');

    if (userId) {
      query = query.addSelect(/*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT fol) AS INT)
        FROM "follow" "fol"
        WHERE ("fol"."followerId" = "user"."id"
         AND "fol"."deletedAt" IS NULL
         AND "fol"."userId" IN ('${userId}'))
         GROUP BY "fol"."followerId", "user"."id"
        ) AS "isFollow"`);
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.email ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere(
            'profile.fullName ::text ILIKE :search OR profile.fullName ::text ILIKE :search OR profile.phone ::text ILIKE :search',
            {
              search: `%${search}%`,
            },
          );
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, users] = await useCatch(
      query
        .orderBy('user.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: users,
    });
  }

  async findOneBy(selections: GetOneUserSelections): Promise<User> {
    const { userId, email, token, username } = selections;
    let query = this.driver
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .leftJoinAndSelect('user.profile', 'profile');

    if (userId) {
      query = query.andWhere('user.id = :id', { id: userId });
    }

    if (email) {
      query = query.andWhere('user.email = :email', { email });
    }

    if (username) {
      query = query.andWhere('user.username = :username', { username });
    }

    if (token) {
      query = query.andWhere('user.token = :token', { token });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** FindOne one User to the database. */
  async findOnePublicBy(
    selections: GetOneUserSelections,
  ): Promise<GetOnUserPublic> {
    const { userId, email, username, followerId } = selections;
    let query = this.driver
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.username', 'username')
      .addSelect('user.profileId', 'profileId')
      .addSelect('user.nextStep', 'nextStep')
      .addSelect('user.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'fullName', "profile"."fullName",
          'enableShop', "profile"."enableShop",
          'enableGallery', "profile"."enableGallery",
          'enableCommission', "profile"."enableCommission",
          'image', "profile"."image",
          'color', "profile"."color",
          'countryId', "profile"."countryId",
          'url', "profile"."url"
      ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT fol) AS INT)
      FROM "follow" "fol"
      WHERE ("fol"."userId" = "user"."id"
      AND "fol"."deletedAt" IS NULL)
      GROUP BY "fol"."userId", "user"."id"
      ) AS "totalFollowing"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT fol) AS INT)
      FROM "follow" "fol"
      WHERE ("fol"."followerId" = "user"."id"
      AND "fol"."deletedAt" IS NULL)
      GROUP BY "fol"."followerId", "user"."id"
      ) AS "totalFollower"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT sub) AS INT)
      FROM "subscribe" "sub"
      WHERE ("sub"."subscriberId" = "user"."id"
      AND "sub"."expiredAt" >= now()::date
      AND "sub"."deletedAt" IS NULL)
      ) AS "totalSubscribe"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile');

    if (followerId) {
      query = query.addSelect(/*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT fol) AS INT)
      FROM "follow" "fol"
      WHERE ("fol"."followerId" = "user"."id"
       AND "fol"."deletedAt" IS NULL
       AND "fol"."userId" IN ('${followerId}'))
       GROUP BY "fol"."userId", "user"."id"
      ) AS "isFollow"`);
    }

    if (userId) {
      query = query.andWhere('user.id = :id', { id: userId });
    }

    if (username) {
      query = query.andWhere('user.username = :username', { username });
    }

    if (email) {
      query = query.andWhere('user.email = :email', { email });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** FindOne one User to the database. */
  async findOneInfoBy(
    selections: GetOneUserSelections,
  ): Promise<GetOnUserPublic> {
    const { userId, email, followerId } = selections;

    let query = this.driver
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.createdAt', 'createdAt')
      .addSelect('user.email', 'email')
      .addSelect('user.username', 'username')
      .addSelect('user.confirmedAt', 'confirmedAt')
      .addSelect('user.profileId', 'profileId')
      .addSelect('user.organizationId', 'organizationId')
      .addSelect('user.nextStep', 'nextStep')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'fullName', "profile"."fullName",
          'enableShop', "profile"."enableShop",
          'enableGallery', "profile"."enableGallery",
          'enableCommission', "profile"."enableCommission",
          'image', "profile"."image",
          'color', "profile"."color",
          'countryId', "profile"."countryId",
          'url', "profile"."url",
          'currency', jsonb_build_object(
            'symbol', "currency"."symbol",
            'name', "currency"."name",
            'amount', "currency"."amount",
            'code', "currency"."code")
            
      ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'accountId', "wallet"."accountId",
          'amount', "wallet"."amount"
      ) AS "wallet"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'name', "con"."role"
        )
        FROM "contributor" "con"
        WHERE "user"."id" = "con"."userId"
        AND "con"."type" IN ('ORGANIZATION')
        ) AS "role"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT fol) AS INT)
      FROM "follow" "fol"
      WHERE ("fol"."userId" = "user"."id"
      AND "fol"."deletedAt" IS NULL)
      GROUP BY "fol"."userId", "user"."id"
      ) AS "totalFollowing"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT pro) AS INT)
      FROM "product" "pro"
      WHERE ("pro"."userId" = "user"."id"
      AND "pro"."deletedAt" IS NULL)
      GROUP BY "pro"."userId", "user"."id"
      ) AS "totalProduct"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT fol) AS INT)
      FROM "follow" "fol"
      WHERE ("fol"."followerId" = "user"."id"
      AND "fol"."deletedAt" IS NULL)
      GROUP BY "fol"."followerId", "user"."id"
      ) AS "totalFollower"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT sub) AS INT)
      FROM "subscribe" "sub"
      WHERE ("sub"."subscriberId" = "user"."id"
      AND "sub"."expiredAt" >= now()::date
      AND "sub"."deletedAt" IS NULL)
      ) AS "totalSubscribe"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile')
      .leftJoin('user.wallet', 'wallet')
      .leftJoin('profile.currency', 'currency');

    if (followerId) {
      query = query.addSelect(/*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT fol) AS INT)
        FROM "follow" "fol"
        WHERE ("fol"."followerId" = "user"."id"
         AND "fol"."deletedAt" IS NULL
         AND "fol"."userId" IN ('${followerId}'))
         GROUP BY "fol"."userId", "user"."id"
        ) AS "isFollow"`);
    }

    if (userId) {
      query = query.andWhere('user.id = :id', { id: userId });
    }

    if (email) {
      query = query.andWhere('user.email = :email', { email });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one User to the database. */
  async createOne(options: CreateUserOptions): Promise<User> {
    const { email, username, password, profileId, organizationId, nextStep } =
      options;

    const user = new User();
    user.token = generateLongUUID(50);
    user.email = email.toLowerCase();
    user.hashPassword(password);
    user.username = username;
    user.profileId = profileId;
    user.organizationId = organizationId;
    user.nextStep = nextStep;

    const query = this.driver.save(user);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one User to the database. */
  async updateOne(
    selections: UpdateUserSelections,
    options: UpdateUserOptions,
  ): Promise<User> {
    const { userId, profileId } = selections;
    const {
      email,
      username,
      password,
      organizationId,
      accessToken,
      refreshToken,
      deletedAt,
      nextStep,
      confirmedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('user');

    if (userId) {
      findQuery = findQuery.where('user.id = :id', {
        id: userId,
      });
    }

    if (profileId) {
      findQuery = findQuery.where('user.profileId = :profileId', { profileId });
    }

    const [errorFind, user] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    user.email = email;
    user.username = username;
    if (password) {
      user.hashPassword(password);
    }
    user.accessToken = accessToken;
    user.nextStep = nextStep;
    user.refreshToken = refreshToken;
    user.deletedAt = deletedAt;
    user.organizationId = organizationId;
    user.confirmedAt = confirmedAt;

    const query = this.driver.save(user);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

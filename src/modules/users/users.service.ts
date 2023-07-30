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
    const { search, pagination } = selections;
    let query = this.driver
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.confirmedAt', 'confirmedAt')
      .addSelect('user.profileId', 'profileId')
      .addSelect('user.createdAt', 'createdAt')
      .addSelect('user.nextStep', 'nextStep')
      .addSelect(
        'user.organizationInUtilizationId',
        'organizationInUtilizationId',
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'fullName', "profile"."fullName",
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
        AND "user"."organizationInUtilizationId" = "con"."organizationId"
        AND "con"."type" IN ('ORGANIZATION')
        ) AS "role"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'color', "organization"."color",
          'userId', "organization"."userId",
          'name', "organization"."name"
      ) AS "organization"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile')
      .leftJoin('user.organizationInUtilization', 'organization');

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.email ::text ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere(
              'profile.fullName ::text ILIKE :search OR profile.fullName ::text ILIKE :search OR profile.phone ::text ILIKE :search',
              {
                search: `%${search}%`,
              },
            )
            .orWhere('organization.name ::text ILIKE :search', {
              search: `%${search}%`,
            });
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
  async findOneInfoBy(
    selections: GetOneUserSelections,
  ): Promise<GetOnUserPublic> {
    const { userId, email } = selections;
    let query = this.driver
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.createdAt', 'createdAt')
      .addSelect('user.email', 'email')
      .addSelect('user.confirmedAt', 'confirmedAt')
      .addSelect('user.profileId', 'profileId')
      .addSelect('user.nextStep', 'nextStep')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'fullName', "profile"."fullName",
          'image', "profile"."image",
          'color', "profile"."color",
          'countryId', "profile"."countryId",
          'url', "profile"."url"
      ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."userId" = "user"."id"
      AND "con"."deletedAt" IS NULL
      AND "con"."type" IN ('ORGANIZATION'))
      GROUP BY "con"."userId", "con"."type", "user"."id"
      ) AS "organizationTotal"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'name', "con"."role"
        )
        FROM "contributor" "con"
        WHERE "user"."id" = "con"."userId"
        AND "user"."organizationInUtilizationId" = "con"."organizationId"
        AND "con"."type" IN ('ORGANIZATION')
        ) AS "role"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'color', "organization"."color",
          'userId', "organization"."userId",
          'name', "organization"."name"
      ) AS "organization"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile')
      .leftJoin('user.organizationInUtilization', 'organization');

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
    const {
      email,
      username,
      password,
      profileId,
      nextStep,
      organizationInUtilizationId,
    } = options;

    const user = new User();
    user.token = generateLongUUID(50);
    user.email = email.toLowerCase();
    user.hashPassword(password);
    user.username = username;
    user.profileId = profileId;
    user.nextStep = nextStep;
    user.organizationInUtilizationId = organizationInUtilizationId;

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
      accessToken,
      refreshToken,
      deletedAt,
      nextStep,
      confirmedAt,
      organizationInUtilizationId,
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

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.email = email;
    findItem.username = username;
    if (password) {
      findItem.hashPassword(password);
    }
    findItem.accessToken = accessToken;
    findItem.nextStep = nextStep;
    findItem.refreshToken = refreshToken;
    findItem.deletedAt = deletedAt;
    findItem.confirmedAt = confirmedAt;
    findItem.organizationInUtilizationId = organizationInUtilizationId;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

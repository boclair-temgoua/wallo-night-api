import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Slug, generateLongUUID } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { User } from '../../models/User';
import {
  CreateUserOptions,
  GetOnUserPublic,
  GetOneUserSelections,
  GetUsersSelections,
  UpdateUserOptions,
  UpdateUserSelections,
  hashPassword,
} from './users.type';

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
      .addSelect('user.profileId', 'profileId')
      .addSelect('user.createdAt', 'createdAt')
      .addSelect('user.confirmedAt', 'confirmedAt')
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
        WHERE "con"."userId" = "user"."id"
        AND  "con"."organizationId" = "user"."organizationId"
        AND "con"."deletedAt" IS NULL
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
            `profile.lastName ::text ILIKE :search 
              OR profile.phone ::text ILIKE :search 
              OR profile.firstName ::text ILIKE :search`,
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
    const { userId, email, token, username, provider, organizationId, phone } =
      selections;
    let query = this.driver
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .leftJoinAndSelect('user.profile', 'profile');

    if (phone) {
      query = query
        .andWhere('user.phone = :phone', { phone })
        .andWhere('user.isValidPhone IS TRUE');
    }

    if (userId) {
      query = query.andWhere('user.id = :id', { id: userId });
    }

    if (provider) {
      query = query.andWhere('user.provider = :provider', { provider });
    }

    if (organizationId) {
      query = query.andWhere('user.organizationId = :organizationId', {
        organizationId,
      });
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

    const result = await query.getOne();

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
      .addSelect('user.organizationId', 'organizationId')
      .addSelect('user.provider', 'provider')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'fullName', "profile"."fullName",
          'description', "profile"."description",
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
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'count', CAST(COUNT(DISTINCT po) AS INT)
        )
        FROM "post" "po"
        WHERE "po"."organizationId" = "user"."organizationId"
        AND "po"."type" IN ('AUDIO', 'VIDEO', 'ARTICLE')
        AND "po"."deletedAt" IS NULL
        GROUP BY "po"."organizationId", "user"."organizationId"
        ) AS "post"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'count', CAST(COUNT(DISTINCT prod) AS INT)
        )
        FROM "product" "prod"
        WHERE "prod"."organizationId" = "user"."organizationId"
        AND "prod"."model" IN ('PRODUCT')
        AND "prod"."deletedAt" IS NULL
        GROUP BY "prod"."organizationId", "user"."organizationId"
        ) AS "product"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'count', CAST(COUNT(DISTINCT prod) AS INT)
        )
        FROM "product" "prod"
        WHERE "prod"."organizationId" = "user"."organizationId"
        AND "prod"."model" IN ('COMMISSION')
        AND "prod"."deletedAt" IS NULL
        GROUP BY "prod"."organizationId", "user"."organizationId"
        ) AS "commission"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'count', CAST(COUNT(DISTINCT post) AS INT)
        )
        FROM "post"
        WHERE "post"."organizationId" = "user"."organizationId"
        AND "post"."type" IN ('GALLERY')
        AND "post"."deletedAt" IS NULL
        GROUP BY "post"."organizationId", "user"."organizationId"
        ) AS "gallery"`,
      )
      .addSelect(
        /*sql*/ `(
         jsonb_build_object(
        'id', "donation"."id",
        'userId', "donation"."userId",
        'messageWelcome', "donation"."messageWelcome",
        'description', "donation"."description",
        'price', "donation"."price")
        ) AS "donationUser"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'count', CAST(COUNT(DISTINCT tran) AS INT)
        )
        FROM "transaction" "tran"
        WHERE "tran"."model" IN ('DONATION')
        AND "tran"."organizationId" = "user"."organizationId"
        GROUP BY "tran"."organizationId", "user"."organizationId"
        ) AS "donation"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'count', CAST(COUNT(DISTINCT mem) AS INT)
        )
        FROM "membership" "mem"
        WHERE "mem"."organizationId" = "user"."organizationId"
        AND "mem"."deletedAt" IS NULL
        GROUP BY "mem"."organizationId", "user"."organizationId"
        ) AS "membership"`,
      )
      .where('user.deletedAt IS NULL')
      .leftJoin('user.profile', 'profile')
      .leftJoin('user.donation', 'donation')
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

    if (username) {
      query = query.andWhere('user.username = :username', { username });
    }

    if (email) {
      query = query.andWhere('user.email = :email', { email });
    }

    const user = await query.getRawOne();

    return user;
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
      .addSelect('user.provider', 'provider')
      .addSelect('user.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'fullName', "profile"."fullName",
          'description', "profile"."description",
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
        'amount', CAST(SUM("tran"."amountConvert") AS DECIMAL),
        'count', CAST(COUNT(DISTINCT tran) AS INT)
        )
        FROM "transaction" "tran"
        WHERE "tran"."model" IN ('PRODUCT')
        AND "tran"."organizationId" = "user"."organizationId"
        GROUP BY "tran"."organizationId", "user"."organizationId"
        ) AS "product"`,
      )
      .addSelect(
        /*sql*/ `(
         jsonb_build_object(
        'id', "donation"."id",
        'userId', "donation"."userId",
        'messageWelcome', "donation"."messageWelcome",
        'description', "donation"."description",
        'price', "donation"."price"
        )
        ) AS "donationUser"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'amount', CAST(SUM("tran"."amountConvert") AS DECIMAL),
        'count', CAST(COUNT(DISTINCT tran) AS INT)
        )
        FROM "transaction" "tran"
        WHERE "tran"."model" IN ('DONATION')
        AND "tran"."organizationId" = "user"."organizationId"
        GROUP BY "tran"."organizationId", "user"."organizationId"
        ) AS "donation"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'amount', CAST(SUM("tran"."amountConvert") AS DECIMAL),
        'count', CAST(COUNT(DISTINCT tran) AS INT)
        )
        FROM "transaction" "tran"
        WHERE "tran"."model" IN ('MEMBERSHIP')
        AND "tran"."organizationId" = "user"."organizationId"
        GROUP BY "tran"."organizationId", "user"."organizationId"
        ) AS "membership"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'name', "con"."role"
        )
        FROM "contributor" "con"
        WHERE "con"."userId" = "user"."id"
        AND  "con"."organizationId" = "user"."organizationId"
        AND "con"."deletedAt" IS NULL
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
      .leftJoin('user.organization', 'organization')
      .leftJoin('user.donation', 'donation')
      .leftJoin('organization.wallet', 'wallet')
      .leftJoin('organization.user', 'userOrg')
      .leftJoin('userOrg.profile', 'profile')
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

    const user = await query.getRawOne();

    return user;
  }

  /** Create one User to the database. */
  async createOne(options: CreateUserOptions): Promise<User> {
    const {
      email,
      provider,
      confirmedAt,
      username,
      password,
      profileId,
      phone,
      isValidPhone,
      organizationId,
    } = options;

    const user = new User();
    user.token = generateLongUUID(50);
    user.email = email;
    user.password = await hashPassword(password);
    user.username = Slug(username.toLocaleLowerCase());
    user.provider = provider;
    user.profileId = profileId;
    user.isValidPhone = isValidPhone;
    user.phone = phone;
    user.organizationId = organizationId;
    user.confirmedAt = confirmedAt;

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
      phone,
      email,
      username,
      password,
      organizationId,
      deletedAt,
      isValidPhone,
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
      user.password = await hashPassword(password);
    }
    user.deletedAt = deletedAt;
    user.phone = phone;
    user.isValidPhone = isValidPhone;
    user.organizationId = organizationId;
    user.confirmedAt = confirmedAt;

    const query = this.driver.save(user);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

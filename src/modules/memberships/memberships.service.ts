import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Membership } from '../../models/Membership';
import {
  CreateMembershipsOptions,
  GetMembershipsSelections,
  GetOneMembershipsSelections,
  UpdateMembershipsOptions,
  UpdateMembershipsSelections,
} from './memberships.type';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private driver: Repository<Membership>,
  ) {}

  async findAll(selections: GetMembershipsSelections): Promise<any> {
    const { search, pagination, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('membership')
      .select('membership.id', 'id')
      .addSelect('membership.title', 'title')
      .addSelect('membership.status', 'status')
      .addSelect('membership.month', 'month')
      .addSelect('membership.description', 'description')
      .addSelect('membership.organizationId', 'organizationId')
      .addSelect('membership.price', 'price')
      .addSelect('membership.messageWelcome', 'messageWelcome')
      .addSelect('membership.currencyId', 'currencyId')
      .addSelect('membership.userId', 'userId')
      .addSelect('membership.model', 'model')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'code', "currency"."code",
          'symbol', "currency"."symbol"
        ) AS "currency"`,
      )
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
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'size', "upl"."size",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "membership"."id"
          AND "upl"."membershipId" = "membership"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('MEMBERSHIP')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "membership"."id", "upl"."uploadableId"
          ) AS "uploadsImages"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'size', "upl"."size",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "membership"."id"
          AND "upl"."membershipId" = "membership"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('MEMBERSHIP')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "membership"."id", "upl"."uploadableId"
          ) AS "uploadsFiles"`,
      )
      // .addSelect(
      //   /*sql*/ `(
      //     SELECT jsonb_build_object(
      //     'amount', CAST((SUM("contr"."amountConvert") * "currency"."amount") / 100 AS BIGINT),
      //     'total', CAST(COUNT(DISTINCT contr) AS BIGINT)
      //     )
      //     FROM "contribution" "contr"
      //     WHERE "contr"."membershipId" = "membership"."id"
      //     AND "contr"."deletedAt" IS NULL
      //     GROUP BY "contr"."membershipId", "membership"."id"
      //     ) AS "contribution"`,
      // )
      .where('membership.deletedAt IS NULL')
      .leftJoin('membership.organization', 'organization')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('membership.currency', 'currency');

    if (userId) {
      query = query.andWhere('membership.userId = :userId', {
        userId,
      });
    }

    if (organizationId) {
      query = query.andWhere('membership.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('membership.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('membership.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, memberships] = await useCatch(
      query
        .orderBy('membership.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: memberships,
    });
  }

  async findOneBy(
    selections: GetOneMembershipsSelections,
  ): Promise<Membership> {
    const { membershipId, organizationId } = selections;
    let query = this.driver
      .createQueryBuilder('membership')
      .select('membership.id', 'id')
      .addSelect('membership.title', 'title')
      .addSelect('membership.status', 'status')
      .addSelect('membership.month', 'month')
      .addSelect('membership.description', 'description')
      .addSelect('membership.organizationId', 'organizationId')
      .addSelect('membership.price', 'price')
      .addSelect('membership.messageWelcome', 'messageWelcome')
      .addSelect('membership.currencyId', 'currencyId')
      .addSelect('membership.model', 'model')
      .addSelect('membership.userId', 'userId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'code', "currency"."code",
          'symbol', "currency"."symbol"
        ) AS "currency"`,
      )
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
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'size', "upl"."size",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "membership"."id"
          AND "upl"."membershipId" = "membership"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('MEMBERSHIP')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "membership"."id", "upl"."uploadableId"
          ) AS "uploadsImages"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'size', "upl"."size",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "membership"."id"
          AND "upl"."membershipId" = "membership"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('MEMBERSHIP')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "membership"."id", "upl"."uploadableId"
          ) AS "uploadsFiles"`,
      )
      .where('membership.deletedAt IS NULL')
      .leftJoin('membership.organization', 'organization')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('membership.currency', 'currency');

    if (membershipId) {
      query = query.andWhere('membership.id = :id', { id: membershipId });
    }

    if (organizationId) {
      query = query.andWhere('membership.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('membership not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Memberships to the database. */
  async createOne(options: CreateMembershipsOptions): Promise<Membership> {
    const {
      title,
      status,
      month,
      description,
      messageWelcome,
      price,
      currencyId,
      userId,
      organizationId,
    } = options;

    const membership = new Membership();
    membership.title = title;
    membership.month = month;
    membership.description = description;
    membership.messageWelcome = messageWelcome;
    membership.price = price;
    membership.currencyId = currencyId;
    membership.userId = userId;
    membership.currencyId = currencyId;
    membership.organizationId = organizationId;

    const query = this.driver.save(membership);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Memberships to the database. */
  async updateOne(
    selections: UpdateMembershipsSelections,
    options: UpdateMembershipsOptions,
  ): Promise<Membership> {
    const { membershipId } = selections;
    const {
      title,
      month,
      status,
      description,
      messageWelcome,
      price,
      currencyId,
      userId,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('membership');

    if (membershipId) {
      findQuery = findQuery.where('membership.id = :id', { id: membershipId });
    }

    const [errorFind, membership] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    membership.title = title;
    membership.month = month;
    membership.status = status;
    membership.description = description;
    membership.messageWelcome = messageWelcome;
    membership.price = price;
    membership.currencyId = currencyId;
    membership.userId = userId;
    membership.deletedAt = deletedAt;

    const query = this.driver.save(membership);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

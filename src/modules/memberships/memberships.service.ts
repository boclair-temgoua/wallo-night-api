import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from '../../models/Membership';
import { Repository, Brackets } from 'typeorm';
import {
  CreateMembershipsOptions,
  GetMembershipsSelections,
  GetOneMembershipsSelections,
  UpdateMembershipsOptions,
  UpdateMembershipsSelections,
} from './memberships.type';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private driver: Repository<Membership>,
  ) {}

  async findAll(selections: GetMembershipsSelections): Promise<any> {
    const { search, pagination, organizationId, userId } = selections;

    let query = this.driver
      .createQueryBuilder('membership')
      .select('membership.id', 'id')
      .addSelect('membership.title', 'title')
      .addSelect('membership.image', 'image')
      .addSelect('membership.description', 'description')
      .addSelect('membership.messageWelcome', 'messageWelcome')
      .addSelect('membership.pricePerMonthly', 'pricePerMonthly')
      .addSelect('membership.pricePerYearly', 'pricePerYearly')
      .addSelect('membership.currencyId', 'currencyId')
      .addSelect('membership.userId', 'userId')
      .addSelect('membership.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'code', "currency"."code",
          'symbol', "currency"."symbol"
        ) AS "currency"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'amount', CAST((SUM("contr"."amountConvert") * "currency"."amount") / 100 AS BIGINT),
          'total', CAST(COUNT(DISTINCT contr) AS BIGINT)
          )
          FROM "contribution" "contr"
          WHERE "contr"."membershipId" = "membership"."id"
          AND "contr"."deletedAt" IS NULL
          GROUP BY "contr"."membershipId", "membership"."id"
          ) AS "contribution"`,
      )
      .where('membership.deletedAt IS NULL')
      .leftJoin('membership.currency', 'currency');

    if (organizationId) {
      query = query.andWhere('membership.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (userId) {
      query = query.andWhere('membership.userId = :userId', {
        userId,
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

    const [error, Memberships] = await useCatch(
      query
        .orderBy('membership.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Memberships,
    });
  }

  async findOneBy(
    selections: GetOneMembershipsSelections,
  ): Promise<Membership> {
    const { membershipId } = selections;
    let query = this.driver
      .createQueryBuilder('membership')
      .select('membership.id', 'id')
      .addSelect('membership.title', 'title')
      .addSelect('membership.isActive', 'isActive')
      .addSelect('membership.image', 'image')
      .addSelect('membership.description', 'description')
      .addSelect('membership.messageWelcome', 'messageWelcome')
      .addSelect('membership.pricePerMonthly', 'pricePerMonthly')
      .addSelect('membership.pricePerYearly', 'pricePerYearly')
      .addSelect('membership.currencyId', 'currencyId')
      .addSelect('membership.userId', 'userId')
      .addSelect('membership.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'code', "currency"."code",
          'symbol', "currency"."symbol"
        ) AS "currency"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'amount', CAST((SUM("contr"."amountConvert") * "currency"."amount") / 100 AS BIGINT),
        'total', CAST(COUNT(DISTINCT contr) AS BIGINT)
        )
        FROM "contribution" "contr"
        WHERE "contr"."membershipId" = "membership"."id"
        AND "contr"."deletedAt" IS NULL
        GROUP BY "contr"."membershipId", "membership"."id"
        ) AS "contribution"`,
      )
      .where('membership.deletedAt IS NULL')
      .leftJoin('membership.currency', 'currency');

    if (membershipId) {
      query = query.andWhere('membership.id = :id', { id: membershipId });
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
      image,
      isActive,
      description,
      messageWelcome,
      pricePerMonthly,
      pricePerYearly,
      currencyId,
      userId,
      organizationId,
    } = options;

    const membership = new Membership();
    membership.title = title;
    membership.image = image;
    membership.isActive = isActive;
    membership.description = description;
    membership.messageWelcome = messageWelcome;
    membership.pricePerMonthly = pricePerMonthly;
    membership.pricePerYearly = pricePerYearly;
    membership.currencyId = currencyId;
    membership.userId = userId;
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
      image,
      description,
      messageWelcome,
      pricePerMonthly,
      pricePerYearly,
      currencyId,
      userId,
      isActive,
      organizationId,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('membership');

    if (membershipId) {
      findQuery = findQuery.where('membership.id = :id', { id: membershipId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.image = image;
    findItem.isActive = isActive;
    findItem.description = description;
    findItem.messageWelcome = messageWelcome;
    findItem.pricePerMonthly = pricePerMonthly;
    findItem.pricePerYearly = pricePerYearly;
    findItem.currencyId = currencyId;
    findItem.userId = userId;
    findItem.organizationId = organizationId;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

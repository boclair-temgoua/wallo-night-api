import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from '../../models/Commission';
import { Repository, Brackets } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import {
  CreateCommissionsOptions,
  GetOneCommissionsSelections,
  GetCommissionsSelections,
  UpdateCommissionsOptions,
  UpdateCommissionsSelections,
} from './commissions.type';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission)
    private driver: Repository<Commission>,
  ) {}

  async findAll(selections: GetCommissionsSelections): Promise<any> {
    const { search, pagination, status, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('commission')
      .select('commission.id', 'id')
      .addSelect('commission.image', 'image')
      .addSelect('commission.price', 'price')
      .addSelect('commission.title', 'title')
      .addSelect('commission.userId', 'userId')
      .addSelect('commission.urlMedia', 'urlMedia')
      .addSelect('commission.description', 'description')
      .addSelect('commission.enableLimitSlot', 'enableLimitSlot')
      .addSelect('commission.limitSlot', 'limitSlot')
      .addSelect('commission.messageAfterPayment', 'messageAfterPayment')
      .addSelect('commission.status', 'status')
      .addSelect('commission.currencyId', 'currencyId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'symbol', "currency"."symbol",
          'name', "currency"."name",
          'code', "currency"."code"
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
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "commission"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('COMMISSION')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "commission"."id", "upl"."uploadableId"
          ) AS "uploadsImage"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "commission"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('COMMISSION')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "commission"."id", "upl"."uploadableId"
          ) AS "uploadsFile"`,
      )
      .addSelect('commission.createdAt', 'createdAt')
      .where('commission.deletedAt IS NULL')
      .leftJoin('commission.currency', 'currency')
      .leftJoin('commission.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (status) {
      query = query.andWhere('commission.status = :status', { status });
    }

    if (organizationId) {
      query = query.andWhere('commission.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('commission.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('commission.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, commissions] = await useCatch(
      query
        .orderBy('commission.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: commissions,
    });
  }

  async findOneBy(
    selections: GetOneCommissionsSelections,
  ): Promise<Commission> {
    const { commissionId, userId, organizationId } = selections;
    let query = this.driver
      .createQueryBuilder('commission')
      .select('commission.id', 'id')
      .addSelect('commission.image', 'image')
      .addSelect('commission.price', 'price')
      .addSelect('commission.title', 'title')
      .addSelect('commission.userId', 'userId')
      .addSelect('commission.urlMedia', 'urlMedia')
      .addSelect('commission.description', 'description')
      .addSelect('commission.enableLimitSlot', 'enableLimitSlot')
      .addSelect('commission.limitSlot', 'limitSlot')
      .addSelect('commission.messageAfterPayment', 'messageAfterPayment')
      .addSelect('commission.status', 'status')
      .addSelect('commission.currencyId', 'currencyId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
            'symbol', "currency"."symbol",
            'name', "currency"."name",
            'code', "currency"."code"
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
      .addSelect('commission.createdAt', 'createdAt')
      .where('commission.deletedAt IS NULL')
      .leftJoin('commission.currency', 'currency')
      .leftJoin('commission.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (commissionId) {
      query = query.andWhere('commission.id = :id', { id: commissionId });
    }

    if (userId) {
      query = query.andWhere('commission.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('commission.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('commission not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Commissions to the database. */
  async createOne(options: CreateCommissionsOptions): Promise<Commission> {
    const {
      title,
      image,
      urlMedia,
      price,
      description,
      messageAfterPayment,
      status,
      currencyId,
      limitSlot,
      enableLimitSlot,
      userId,
      organizationId,
    } = options;

    const commission = new Commission();
    commission.title = title;
    commission.price = price;
    commission.image = image;
    commission.status = status;
    commission.currencyId = currencyId;
    commission.limitSlot = limitSlot;
    commission.enableLimitSlot = enableLimitSlot;
    commission.messageAfterPayment = messageAfterPayment;
    commission.urlMedia = urlMedia;
    commission.description = description;
    commission.userId = userId;
    commission.organizationId = organizationId;

    const query = this.driver.save(commission);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Commissions to the database. */
  async updateOne(
    selections: UpdateCommissionsSelections,
    options: UpdateCommissionsOptions,
  ): Promise<Commission> {
    const { commissionId } = selections;
    const {
      title,
      image,
      urlMedia,
      price,
      description,
      messageAfterPayment,
      status,
      limitSlot,
      enableLimitSlot,
      currencyId,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('commission');

    if (commissionId) {
      findQuery = findQuery.where('commission.id = :id', { id: commissionId });
    }

    const [errorFind, commission] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    commission.title = title;
    commission.price = price;
    commission.image = image;
    commission.status = status;
    commission.currencyId = currencyId;
    commission.limitSlot = limitSlot;
    commission.enableLimitSlot = enableLimitSlot;
    commission.messageAfterPayment = messageAfterPayment;
    commission.urlMedia = urlMedia;
    commission.description = description;
    commission.deletedAt = deletedAt;

    const query = this.driver.save(commission);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

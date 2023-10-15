import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from '../../models';
import { Repository, Brackets } from 'typeorm';
import {
  CreateDiscountsOptions,
  GetDiscountsSelections,
  GetOneDiscountsSelections,
  UpdateDiscountsOptions,
  UpdateDiscountsSelections,
} from './discounts.type';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { isNotUndefined } from '../../app/utils/commons/generate-random';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private driver: Repository<Discount>,
  ) {}

  async findAll(selections: GetDiscountsSelections): Promise<any> {
    const { search, pagination, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('discount')
      .select('discount.id', 'id')
      .addSelect('discount.code', 'code')
      .addSelect('discount.userId', 'userId')
      .addSelect('discount.expiredAt', 'expiredAt')
      .addSelect('discount.enableExpiredAt', 'enableExpiredAt')
      .addSelect('discount.percent', 'percent')
      .addSelect('discount.description', 'description')
      .addSelect('discount.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `
      CASE WHEN ("discount"."expiredAt" >= now()::date
          AND "discount"."deletedAt" IS NULL
          AND "discount"."enableExpiredAt" IS TRUE) THEN true 
          WHEN ("discount"."expiredAt" < now()::date
          AND "discount"."deletedAt" IS NULL
          AND "discount"."enableExpiredAt" IS TRUE) THEN false
          ELSE true
          END
        `,
        'isValid',
      )
      .where('discount.deletedAt IS NULL');

    if (organizationId) {
      query = query.andWhere('discount.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('discount.code ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('discount.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, discounts] = await useCatch(
      query
        .orderBy('discount.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: discounts,
    });
  }

  async findAllNotPaginate(selections: GetDiscountsSelections): Promise<any> {
    const { search, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('discount')
      .select('discount.id', 'id')
      .addSelect('discount.code', 'code')
      .addSelect('discount.userId', 'userId')
      .addSelect('discount.expiredAt', 'expiredAt')
      .addSelect('discount.enableExpiredAt', 'enableExpiredAt')
      .addSelect('discount.percent', 'percent')
      .addSelect('discount.description', 'description')
      .addSelect('discount.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `
      CASE WHEN ("discount"."expiredAt" >= now()::date
          AND "discount"."deletedAt" IS NULL
          AND "discount"."enableExpiredAt" IS TRUE) THEN true 
          WHEN ("discount"."expiredAt" < now()::date
          AND "discount"."deletedAt" IS NULL
          AND "discount"."enableExpiredAt" IS TRUE) THEN false
          ELSE true
          END
        `,
        'isValid',
      )
      .where('discount.deletedAt IS NULL');

    if (organizationId) {
      query = query.andWhere('discount.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('discount.code ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('discount.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [error, discounts] = await useCatch(
      query.orderBy('discount.createdAt', 'DESC').getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return discounts;
  }

  async findOneBy(selections: GetOneDiscountsSelections): Promise<Discount> {
    const { discountId } = selections;
    let query = this.driver
      .createQueryBuilder('discount')
      .where('discount.deletedAt IS NULL');

    if (discountId) {
      query = query.andWhere('discount.id = :id', { id: discountId });
    }

    const discount = await query.getOne();

    return discount;
  }

  /** Create one Discounts to the database. */
  async createOne(options: CreateDiscountsOptions): Promise<Discount> {
    const {
      code,
      userId,
      percent,
      expiredAt,
      startedAt,
      description,
      organizationId,
      enableExpiredAt,
    } = options;

    const discount = new Discount();
    discount.code = code;
    discount.description = description;
    discount.userId = userId;
    discount.percent = percent;
    discount.startedAt = startedAt;
    discount.expiredAt = expiredAt;
    discount.organizationId = organizationId;
    discount.enableExpiredAt = enableExpiredAt;

    const query = this.driver.save(discount);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Discounts to the database. */
  async updateOne(
    selections: UpdateDiscountsSelections,
    options: UpdateDiscountsOptions,
  ): Promise<Discount> {
    const { discountId } = selections;
    const {
      code,
      description,
      percent,
      expiredAt,
      startedAt,
      deletedAt,
      enableExpiredAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('discount');

    if (discountId) {
      findQuery = findQuery.where('discount.id = :id', { id: discountId });
    }

    const [errorFind, discount] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    discount.code = code;
    discount.description = description;
    discount.percent = percent;
    discount.startedAt = startedAt;
    discount.expiredAt = expiredAt;
    discount.enableExpiredAt = enableExpiredAt;
    discount.deletedAt = deletedAt;

    const query = this.driver.save(discount);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

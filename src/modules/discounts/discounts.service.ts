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

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private driver: Repository<Discount>,
  ) {}

  async findAll(selections: GetDiscountsSelections): Promise<any> {
    const { search, pagination, userId } = selections;

    let query = this.driver
      .createQueryBuilder('discount')
      .where('discount.deletedAt IS NULL');

    if (userId) {
      query = query.andWhere('discount.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('discount.name ::text ILIKE :search', {
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
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: discounts,
    });
  }

  async findOneBy(selections: GetOneDiscountsSelections): Promise<Discount> {
    const { discountId } = selections;
    let query = this.driver
      .createQueryBuilder('discount')
      .where('discount.deletedAt IS NULL');

    if (discountId) {
      query = query.andWhere('discount.id = :id', { id: discountId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('discount not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Discounts to the database. */
  async createOne(options: CreateDiscountsOptions): Promise<Discount> {
    const {
      code,
      description,
      isExpired,
      userId,
      percent,
      expiredAt,
      startedAt,
    } = options;

    const discount = new Discount();
    discount.code = code;
    discount.description = description;
    discount.userId = userId;
    discount.percent = percent;
    discount.isExpired = isExpired;
    discount.startedAt = startedAt;
    discount.expiredAt = expiredAt;

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
      isExpired,
      description,
      isActive,
      percent,
      expiredAt,
      startedAt,
      deletedAt,
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
    discount.isActive = isActive;
    discount.isExpired = isExpired;
    discount.startedAt = startedAt;
    discount.expiredAt = expiredAt;
    discount.deletedAt = deletedAt;

    const query = this.driver.save(discount);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

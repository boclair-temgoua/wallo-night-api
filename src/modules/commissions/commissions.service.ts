import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from '../../models/Commission';
import { Repository, Brackets } from 'typeorm';
import * as Slug from 'slug';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { generateNumber } from '../../app/utils/commons';
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
    const { search, pagination, userId } = selections;

    let query = this.driver
      .createQueryBuilder('commission')
      .select('commission.id', 'id')
      .addSelect('commission.image', 'image')
      .addSelect('commission.price', 'price')
      .addSelect('commission.title', 'title')
      .addSelect('commission.userId', 'userId')
      .addSelect('commission.urlMedia', 'urlMedia')
      .addSelect('commission.description', 'description')
      .addSelect('commission.isLimitSlot', 'isLimitSlot')
      .addSelect('commission.limitSlot', 'limitSlot')
      .addSelect('commission.messageAfterPurchase', 'messageAfterPurchase')
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

    if (userId) {
      query = query.andWhere('commission.userId = :userId', { userId });
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
    const { commissionId, userId } = selections;
    let query = this.driver
      .createQueryBuilder('commission')
      .select('commission.id', 'id')
      .addSelect('commission.image', 'image')
      .addSelect('commission.price', 'price')
      .addSelect('commission.title', 'title')
      .addSelect('commission.userId', 'userId')
      .addSelect('commission.urlMedia', 'urlMedia')
      .addSelect('commission.description', 'description')
      .addSelect('commission.isLimitSlot', 'isLimitSlot')
      .addSelect('commission.limitSlot', 'limitSlot')
      .addSelect('commission.messageAfterPurchase', 'messageAfterPurchase')
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
      messageAfterPurchase,
      status,
      currencyId,
      limitSlot,
      isLimitSlot,
      userId,
    } = options;

    const commission = new Commission();
    commission.title = title;
    commission.price = price;
    commission.image = image;
    commission.status = status;
    commission.currencyId = currencyId;
    commission.limitSlot = limitSlot;
    commission.isLimitSlot = isLimitSlot;
    commission.messageAfterPurchase = messageAfterPurchase;
    commission.urlMedia = urlMedia;
    commission.description = description;
    commission.userId = userId;

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
      messageAfterPurchase,
      status,
      limitSlot,
      isLimitSlot,
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
    commission.isLimitSlot = isLimitSlot;
    commission.messageAfterPurchase = messageAfterPurchase;
    commission.urlMedia = urlMedia;
    commission.description = description;
    commission.deletedAt = deletedAt;

    const query = this.driver.save(commission);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

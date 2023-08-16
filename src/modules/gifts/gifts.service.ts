import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gift } from '../../models/Gift';
import { Repository, Brackets } from 'typeorm';
import {
  CreateGiftsOptions,
  GetGiftsSelections,
  GetOneGiftsSelections,
  UpdateGiftsOptions,
  UpdateGiftsSelections,
} from './gifts.type';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private driver: Repository<Gift>,
  ) {}

  async findAll(selections: GetGiftsSelections): Promise<any> {
    const { search, pagination, userId } = selections;

    let query = this.driver
      .createQueryBuilder('gift')
      .select('gift.id', 'id')
      .addSelect('gift.title', 'title')
      .addSelect('gift.amount', 'amount')
      .addSelect('gift.image', 'image')
      .addSelect('gift.currencyId', 'currencyId')
      .addSelect('gift.isActive', 'isActive')
      .addSelect('gift.createdAt', 'createdAt')
      .addSelect('gift.expiredAt', 'expiredAt')
      .addSelect('gift.userId', 'userId')
      .addSelect('gift.description', 'description')
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
          WHERE "contr"."giftId" = "gift"."id"
          AND "contr"."deletedAt" IS NULL
          GROUP BY "contr"."giftId", "gift"."id"
          ) AS "contribution"`,
      )
      .where('gift.deletedAt IS NULL')
      .leftJoin('gift.currency', 'currency');

    if (userId) {
      query = query.andWhere('gift.userId = :userId', {
        userId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('gift.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('gift.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Gifts] = await useCatch(
      query
        .orderBy('gift.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Gifts,
    });
  }

  async findOneBy(selections: GetOneGiftsSelections): Promise<Gift> {
    const { giftId } = selections;
    let query = this.driver
      .createQueryBuilder('gift')
      .select('gift.id', 'id')
      .addSelect('gift.title', 'title')
      .addSelect('gift.amount', 'amount')
      .addSelect('gift.image', 'image')
      .addSelect('gift.currencyId', 'currencyId')
      .addSelect('gift.isActive', 'isActive')
      .addSelect('gift.createdAt', 'createdAt')
      .addSelect('gift.expiredAt', 'expiredAt')
      .addSelect('gift.userId', 'userId')
      .addSelect('gift.description', 'description')
      .addSelect(
        /*sql*/ `jsonb_build_object(
      'code', "currency"."code",
      'amount', "currency"."amount",
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
          WHERE "contr"."giftId" = "gift"."id"
          AND "contr"."deletedAt" IS NULL
          GROUP BY "contr"."giftId", "gift"."id"
          ) AS "contribution"`,
      )
      .where('gift.deletedAt IS NULL')
      .andWhere('gift.expiredAt >= now()')
      .leftJoin('gift.currency', 'currency');

    if (giftId) {
      query = query.andWhere('gift.id = :id', { id: giftId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('gift not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Gifts to the database. */
  async createOne(options: CreateGiftsOptions): Promise<Gift> {
    const {
      description,
      title,
      isActive,
      amount,
      image,
      currencyId,
      expiredAt,
      userId,
    } = options;

    const gift = new Gift();
    gift.title = title;
    gift.isActive = isActive;
    gift.amount = amount * 100;
    gift.userId = userId;
    gift.image = image;
    gift.currencyId = currencyId;
    gift.description = description;
    gift.expiredAt = expiredAt;

    const query = this.driver.save(gift);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Gifts to the database. */
  async updateOne(
    selections: UpdateGiftsSelections,
    options: UpdateGiftsOptions,
  ): Promise<Gift> {
    const { giftId } = selections;
    const {
      description,
      title,
      isActive,
      amount,
      image,
      currencyId,
      expiredAt,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('Gift');

    if (giftId) {
      findQuery = findQuery.where('gift.id = :id', { id: giftId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.amount = amount * 100;
    findItem.isActive = isActive;
    findItem.image = image;
    findItem.currencyId = currencyId;
    findItem.description = description;
    findItem.expiredAt = expiredAt;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

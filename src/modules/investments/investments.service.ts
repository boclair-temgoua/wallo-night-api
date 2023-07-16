import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Investment } from '../../models/Investment';
import { Repository } from 'typeorm';
import {
  CreateInvestmentOptions,
  GetOneInvestmentSelections,
  GetInvestmentsSelections,
  UpdateInvestmentSelections,
  UpdateInvestmentOptions,
} from './investments.type';
import { useCatch } from '../../app/utils/use-catch';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination/with-pagination';
import { generateLongUUID } from '../../app/utils/commons';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private driver: Repository<Investment>,
  ) {}

  async findAll(
    selections: GetInvestmentsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, organizationId, donationId } =
      selections;

    let query = this.driver
      .createQueryBuilder('investment')
      .select('investment.id', 'id')
      .addSelect('investment.amount', 'amount')
      .addSelect('investment.expiredAt', 'expiredAt')
      .addSelect('investment.description', 'description')
      .addSelect('investment.createdAt', 'createdAt')
      .addSelect('investment.token', 'token')
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'amount', "donation"."amount",
        'title', "donation"."title",
        'id', "donation"."id"
    ) AS "donation"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'code', "currency"."code",
        'symbol', "currency"."symbol"
    ) AS "currency"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "profile"."id",
        'userId', "user"."id",
        'firstName', "profile"."firstName",
        'lastName', "profile"."lastName",
        'image', "profile"."image",
        'color', "profile"."color",
        'countryId', "profile"."countryId",
        'url', "profile"."url"
    ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "organization"."id",
        'color', "organization"."color",
        'userId', "organization"."userId",
        'name', "organization"."name"
    ) AS "organization"`,
      )
      .where('investment.deletedAt IS NULL')
      .leftJoin('investment.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('investment.donation', 'donation')
      .leftJoin('investment.currency', 'currency')
      .leftJoin('investment.organization', 'organization');

    if (userId) {
      query = query.andWhere('investment.userId = :userId', { userId });
    }

    if (donationId) {
      query = query.andWhere('investment.donationId = :donationId', {
        donationId,
      });
    }

    if (organizationId) {
      query = query.andWhere('investment.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere('investment.description ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Investments] = await useCatch(
      query
        .orderBy('investment.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Investments,
    });
  }

  async findOneBy(selections: GetOneInvestmentSelections): Promise<Investment> {
    const { investmentId, donationId } = selections;
    let query = this.driver
      .createQueryBuilder('investment')
      .select('investment.id', 'id')
      .addSelect('investment.amount', 'amount')
      .addSelect('investment.expiredAt', 'expiredAt')
      .addSelect('investment.description', 'description')
      .addSelect('investment.createdAt', 'createdAt')
      .addSelect('investment.token', 'token')
      .addSelect(
        /*sql*/ `jsonb_build_object(
      'code', "currency"."code",
      'symbol', "currency"."symbol"
  ) AS "currency"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
      'id', "profile"."id",
      'userId', "user"."id",
      'firstName', "profile"."firstName",
      'lastName', "profile"."lastName",
      'image', "profile"."image",
      'color', "profile"."color",
      'countryId', "profile"."countryId",
      'url', "profile"."url"
  ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
      'id', "organization"."id",
      'color', "organization"."color",
      'userId', "organization"."userId",
      'name', "organization"."name"
  ) AS "organization"`,
      )
      .where('investment.deletedAt IS NULL')
      .leftJoin('investment.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('investment.currency', 'currency')
      .leftJoin('investment.organization', 'organization');

    if (investmentId) {
      query = query.andWhere('Investment.id = :id', { id: investmentId });
    }

    if (donationId) {
      query = query.andWhere('investment.donationId = :donationId', {
        donationId,
      });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('investment not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Investment to the database. */
  async createOne(options: CreateInvestmentOptions): Promise<Investment> {
    const {
      userId,
      amount,
      expiredAt,
      currencyId,
      donationId,
      description,
      organizationId,
    } = options;

    const investment = new Investment();
    investment.amount = amount;
    investment.userId = userId;
    investment.donationId = donationId;
    investment.token = generateLongUUID(30);
    investment.organizationId = organizationId;
    investment.expiredAt = expiredAt;
    investment.currencyId = currencyId;
    investment.description = description;

    const query = this.driver.save(investment);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
  /** Update one Investment to the database. */
  async updateOne(
    selections: UpdateInvestmentSelections,
    options: UpdateInvestmentOptions,
  ): Promise<Investment> {
    const { investmentId } = selections;
    const { amount, currencyId, description, expiredAt, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('investment');

    if (investmentId) {
      findQuery = findQuery.where('investment.id = :id', {
        id: investmentId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.amount = amount;
    findItem.currencyId = currencyId;
    findItem.expiredAt = expiredAt;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

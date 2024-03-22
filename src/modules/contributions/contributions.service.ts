import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { withPagination } from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Contribution } from '../../models/Contribution';
import {
  CreateContributionOptions,
  GetContributionsSelections,
  GetOneContributionSelections,
  UpdateContributionOptions,
  UpdateContributionSelections,
} from './contributions.type';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private driver: Repository<Contribution>,
  ) {}

  async findAll(
    selections: GetContributionsSelections,
  ): Promise<GetContributionsSelections | any> {
    const { userId, search, currencyId, organizationId, pagination } =
      selections;

    let query = this.driver
      .createQueryBuilder('contribution')
      .select('contribution.id', 'id')
      .addSelect('contribution.amount', 'amount')
      .addSelect('contribution.userId', 'userId')
      .addSelect('contribution.type', 'type')
      .addSelect('contribution.currencyId', 'currencyId')
      .addSelect('contribution.amountConvert', 'amountConvert')
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'fullName', "profile"."fullName",
        'image', "profile"."image",
        'color', "profile"."color",
        'userId', "user"."id",
        'email', "user"."email"
    ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'code', "currency"."code",
          'symbol', "currency"."symbol"
      ) AS "currency"`,
      )
      .where('contribution.deletedAt IS NULL')
      .leftJoin('contribution.user', 'user')
      .leftJoin('contribution.currency', 'currency')
      .leftJoin('user.profile', 'profile');

    if (organizationId) {
      query = query.andWhere('contribution.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (userId) {
      query = query.andWhere('contribution.userId = :userId', { userId });
    }

    if (currencyId) {
      query = query.andWhere('contribution.currencyId = :currencyId', {
        currencyId,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, users] = await useCatch(
      query
        .orderBy('contribution.createdAt', pagination?.sort)
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

  async findOneBy(selections: GetOneContributionSelections): Promise<any> {
    const { type, userId, contributionId } = selections;

    let query = this.driver
      .createQueryBuilder('contribution')
      .select('contribution.id', 'id')
      .addSelect('contribution.amount', 'amount')
      .addSelect('contribution.userId', 'userId')
      .addSelect('contribution.type', 'type')
      .addSelect('contribution.currencyId', 'currencyId')
      .addSelect('contribution.amountConvert', 'amountConvert')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'code', "currency"."code",
          'symbol', "currency"."symbol"
      ) AS "currency"`,
      )
      .where('contribution.deletedAt IS NULL')
      .leftJoin('contribution.user', 'user')
      .leftJoin('contribution.currency', 'currency')
      .leftJoin('user.profile', 'profile');

    if (type) {
      query = query.andWhere('contribution.type = :type', { type });
    }

    if (userId) {
      query = query.andWhere('contribution.userId = :userId', { userId });
    }

    if (contributionId) {
      query = query.andWhere('contribution.id = :id', { id: contributionId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('contribution not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Contribution to the database. */
  async createOne(options: CreateContributionOptions): Promise<Contribution> {
    const { amount, type, userId, currencyId, amountConvert, organizationId } =
      options;

    const contribution = new Contribution();
    contribution.amount = amount;
    contribution.type = type;
    contribution.userId = userId;
    contribution.currencyId = currencyId;
    contribution.organizationId = organizationId;
    contribution.amountConvert = amountConvert;
    const query = this.driver.save(contribution);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Contribution to the database. */
  async updateOne(
    selections: UpdateContributionSelections,
    options: UpdateContributionOptions,
  ): Promise<Contribution> {
    const { deletedAt } = options;
    const { contributionId } = selections;

    let findQuery = this.driver.createQueryBuilder('contribution');

    if (contributionId) {
      findQuery = findQuery.where('contribution.id = :id', {
        id: contributionId,
      });
    }

    const [errorFind, contribution] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    contribution.deletedAt = deletedAt;

    const query = this.driver.save(contribution);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

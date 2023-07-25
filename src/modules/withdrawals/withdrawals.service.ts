import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdrawal } from '../../models/Withdrawal';
import { Brackets, Repository } from 'typeorm';
import {
  CreateWithdrawalOptions,
  GetOneWithdrawalSelections,
  GetWithdrawalsSelections,
  UpdateWithdrawalOptions,
  UpdateWithdrawalSelections,
} from './withdrawals.type';
import { useCatch } from '../../app/utils/use-catch';
import { isNotUndefined } from '../../app/utils/commons/generate-random';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination/with-pagination';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private driver: Repository<Withdrawal>,
  ) {}

  async findAll(
    selections: GetWithdrawalsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('withdrawal')
      .where('withdrawal.deletedAt IS NULL');

    if (userId && isNotUndefined(String(userId))) {
      query = query.andWhere('withdrawal.userId = :userId', { userId });
    }

    if (organizationId && isNotUndefined(String(organizationId))) {
      query = query.andWhere('withdrawal.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search && isNotUndefined(String(search))) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('withdrawal.description ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('withdrawal.title ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Withdrawals] = await useCatch(
      query
        .orderBy('withdrawal.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Withdrawals,
    });
  }

  async findOneBy(selections: GetOneWithdrawalSelections): Promise<Withdrawal> {
    const { withdrawalId } = selections;
    let query = this.driver
      .createQueryBuilder('withdrawalId')
      .where('withdrawal.deletedAt IS NULL');

    if (withdrawalId) {
      query = query.andWhere('withdrawal.id = :id', { id: withdrawalId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('withdrawal not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Withdrawal to the database. */
  async createOne(options: CreateWithdrawalOptions): Promise<Withdrawal> {
    const {
      amount,
      description,
      withdrawalUserId,
      userId,
      confirmedAt,
      organizationId,
    } = options;

    const withdrawal = new Withdrawal();
    withdrawal.amount = amount;
    withdrawal.userId = userId;
    withdrawal.withdrawalUserId = withdrawalUserId;
    withdrawal.confirmedAt = confirmedAt;
    withdrawal.organizationId = organizationId;
    withdrawal.description = description;

    const query = this.driver.save(withdrawal);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Withdrawal to the database. */
  async updateOne(
    selections: UpdateWithdrawalSelections,
    options: UpdateWithdrawalOptions,
  ): Promise<Withdrawal> {
    const { withdrawalId } = selections;
    const { confirmedAt, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('withdrawal');

    if (withdrawalId) {
      findQuery = findQuery.where('withdrawal.id = :id', {
        id: withdrawalId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.confirmedAt = confirmedAt;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

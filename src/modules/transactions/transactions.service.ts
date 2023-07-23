import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../models/Transaction';
import { Repository } from 'typeorm';
import {
  CreateTransactionOptions,
  GetOneTransactionSelections,
  GetTransactionsSelections,
} from './transactions.type';
import { useCatch } from '../../app/utils/use-catch';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination/with-pagination';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private driver: Repository<Transaction>,
  ) {}

  async findAll(
    selections: GetTransactionsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, organizationId, donationId } =
      selections;

    let query = this.driver.createQueryBuilder('transaction');

    if (userId) {
      query = query.where('transaction.userId = :userId', { userId });
    }

    if (donationId) {
      query = query.where('transaction.donationId = :donationId', {
        donationId,
      });
    }

    if (organizationId) {
      query = query.where('transaction.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere('transaction.title ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, transactions] = await useCatch(
      query
        .orderBy('transaction.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: transactions,
    });
  }

  async findOneBy(
    selections: GetOneTransactionSelections,
  ): Promise<Transaction> {
    const { transactionId } = selections;
    let query = this.driver.createQueryBuilder('transaction');

    if (transactionId) {
      query = query.where('transaction.id = :id', { id: transactionId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('transaction not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Transaction to the database. */
  async createOne(options: CreateTransactionOptions): Promise<Transaction> {
    const {
      amount,
      donationId,
      title,
      description,
      contributionId,
      userSendId,
      userReceiveId,
      userId,
      organizationId,
    } = options;

    const transaction = new Transaction();
    transaction.title = title;
    transaction.donationId = donationId;
    transaction.userSendId = userSendId;
    transaction.userReceiveId = userReceiveId;
    transaction.amount = amount;
    transaction.userId = userId;
    transaction.organizationId = organizationId;
    transaction.contributionId = contributionId;
    transaction.description = description;

    const query = this.driver.save(transaction);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
}

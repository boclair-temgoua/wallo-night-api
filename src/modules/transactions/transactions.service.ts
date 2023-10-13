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
import { generateLongUUID } from '../../app/utils/commons';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private driver: Repository<Transaction>,
  ) {}

  async findAll(
    selections: GetTransactionsSelections,
  ): Promise<WithPaginationResponse | null> {
    const {
      search,
      pagination,
      userId,
      model,
      userSendId,
      userReceiveId,
      organizationId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('transaction')
      .select('transaction.id', 'id')
      .addSelect('transaction.amount', 'amount')
      .addSelect('transaction.title', 'title')
      .addSelect('transaction.description', 'description')
      .addSelect('transaction.token', 'token')
      .addSelect('transaction.currency', 'currency')
      .addSelect('transaction.type', 'type')
      .addSelect('transaction.ourEventId', 'ourEventId')
      .addSelect('transaction.organizationId', 'organizationId')
      .addSelect('transaction.model', 'model')
      .addSelect('transaction.userId', 'userId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profileSend"."id",
          'userId', "userSend"."id",
          'email', "userSend"."email",
          'firstName', "profileSend"."firstName",
          'lastName', "profileSend"."lastName",
          'image', "profileSend"."image",
          'color', "profileSend"."color"
      ) AS "profileSend"`,
      )
      .where('transaction.deletedAt IS NULL')
      .leftJoin('transaction.userSend', 'userSend')
      .leftJoin('userSend.profile', 'profileSend');

    if (model) {
      query = query.andWhere('transaction.model = :model', { model });
    }

    if (userId) {
      query = query.andWhere('transaction.userId = :userId', { userId });
    }

    if (userReceiveId) {
      query = query.andWhere('transaction.userReceiveId = :userReceiveId', {
        userReceiveId,
      });
    }

    if (organizationId) {
      query = query.andWhere('transaction.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (userSendId) {
      query = query.andWhere('transaction.userSendId = :userSendId', {
        userSendId,
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
        .getRawMany(),
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
      currency,
      title,
      model,
      userSendId,
      description,
      userReceiveId,
      userId,
      token,
      type,
      ourEventId,
      organizationId,
    } = options;

    const transaction = new Transaction();
    transaction.title = title;
    transaction.model = model;
    transaction.currency = currency;
    transaction.userSendId = userSendId;
    transaction.userReceiveId = userReceiveId;
    transaction.amount = amount;
    transaction.userId = userId;
    transaction.token = token;
    transaction.type = type;
    transaction.ourEventId = ourEventId;
    transaction.description = description;
    transaction.organizationId = organizationId;

    const query = this.driver.save(transaction);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
}

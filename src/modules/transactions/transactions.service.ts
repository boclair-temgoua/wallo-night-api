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
    const { search, pagination, userId, model, userSendId, userReceiveId } =
      selections;

    let query = this.driver
      .createQueryBuilder('transaction')
      .select('transaction.id', 'id')
      .addSelect('transaction.amount', 'amount')
      .addSelect('transaction.type', 'type')
      .addSelect('transaction.title', 'title')
      .addSelect('transaction.currency', 'currency')
      .addSelect('transaction.description', 'description')
      .addSelect('transaction.model', 'model')
      .addSelect('transaction.campaignId', 'campaignId')
      .addSelect('transaction.contributionId', 'contributionId')
      .addSelect('transaction.giftId', 'giftId')
      .addSelect('transaction.userSendId', 'userSendId')
      .addSelect('transaction.userReceiveId', 'userReceiveId')
      .addSelect('transaction.userId', 'userId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "campaign"."id",
          'title', "campaign"."title"
      ) AS "campaign"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "profileSend"."id",
        'userId', "userSend"."id",
        'fullName', "profileSend"."fullName",
        'image', "profileSend"."image",
        'color', "profileSend"."color",
        'countryId', "profileSend"."countryId",
        'url', "profileSend"."url"
    ) AS "profileSend"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "profileReceive"."id",
        'userId', "userReceive"."id",
        'fullName', "profileReceive"."fullName",
        'image', "profileReceive"."image",
        'color', "profileReceive"."color",
        'countryId', "profileReceive"."countryId",
        'url', "profileReceive"."url"
    ) AS "profileReceive"`,
      )
      .where('transaction.deletedAt IS NULL')
      .leftJoin('transaction.userSend', 'userSend')
      .leftJoin('transaction.userReceive', 'userReceive')
      .leftJoin('transaction.gift', 'gift')
      .leftJoin('transaction.campaign', 'campaign')
      .leftJoin('userSend.profile', 'profileSend')
      .leftJoin('userReceive.profile', 'profileReceive');

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

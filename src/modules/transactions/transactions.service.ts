import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { getRandomElement } from '../../app/utils/array';
import { colorsArraysTransaction } from '../../app/utils/commons';
import {
    WithPaginationResponse,
    withPagination,
} from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Transaction } from '../../models/Transaction';
import {
    CreateTransactionOptions,
    GetOneTransactionSelections,
    GetTransactionsSelections,
} from './transactions.type';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private driver: Repository<Transaction>
    ) {}

    async findAll(
        selections: GetTransactionsSelections
    ): Promise<WithPaginationResponse | null> {
        const { search, pagination, model, days, userBuyerId, organizationId } =
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
            .addSelect('transaction.email', 'email')
            .addSelect('transaction.color', 'color')
            .addSelect('transaction.userReceiveId', 'userReceiveId')
            .addSelect('transaction.fullName', 'fullName')
            .addSelect('transaction.userBuyerId', 'userBuyerId')
            .addSelect('transaction.organizationId', 'organizationId')
            .addSelect('transaction.amountConvert', 'amountConvert')
            .addSelect('transaction.orderId', 'orderId')
            .addSelect('transaction.createdAt', 'createdAt')
            .addSelect(
                /*sql*/ `jsonb_build_object(
        'id', "profileSend"."id",
        'userId', "userSend"."id",
        'email', "userSend"."email",
        'fullName', "profileSend"."fullName",
        'firstName', "profileSend"."firstName",
        'lastName', "profileSend"."lastName",
        'image', "profileSend"."image",
        'color', "profileSend"."color",
        'countryId', "profileSend"."countryId",
        'url', "profileSend"."url"
    ) AS "profileSend"`
            )
            .where('transaction.deletedAt IS NULL')
            .leftJoin('transaction.userSend', 'userSend')
            .leftJoin('userSend.profile', 'profileSend');

        if (model) {
            query = query.andWhere('transaction.model = :model', { model });
        }

        if (userBuyerId) {
            query = query.andWhere('transaction.userBuyerId = :userBuyerId', {
                userBuyerId,
            });
        }

        if (days) {
            query = query.andWhere(
                `DATE_TRUNC('day', "transaction"."createdAt") BETWEEN (CURRENT_DATE - INTERVAL '${days} days') AND  CURRENT_DATE`
            );
        }

        if (organizationId) {
            query = query.andWhere(
                'transaction.organizationId = :organizationId',
                {
                    organizationId,
                }
            );
        }

        if (search) {
            query = query.andWhere(
                new Brackets((qb) => {
                    qb.where('transaction.fullName ::text ILIKE :search', {
                        search: `%${search}%`,
                    })
                        .orWhere('transaction.email ::text ILIKE :search', {
                            search: `%${search}%`,
                        })
                        .orWhere('userSend.email ::text ILIKE :search', {
                            search: `%${search}%`,
                        })
                        .orWhere('profileSend.firstName ::text ILIKE :search', {
                            search: `%${search}%`,
                        })
                        .orWhere('profileSend.lastName ::text ILIKE :search', {
                            search: `%${search}%`,
                        });
                })
            );
        }

        const [errorRowCount, rowCount] = await useCatch(query.getCount());
        if (errorRowCount) throw new NotFoundException(errorRowCount);

        const [error, transactions] = await useCatch(
            query
                .orderBy('transaction.createdAt', pagination?.sort)
                .limit(pagination.limit)
                .offset(pagination.offset)
                .getRawMany()
        );
        if (error) throw new NotFoundException(error);

        return withPagination({
            pagination,
            rowCount,
            value: transactions,
        });
    }

    async findGroupOrganization(
        selections: GetTransactionsSelections
    ): Promise<any> {
        const { organizationId, days } = selections;

        let query = this.driver
            .createQueryBuilder('transaction')
            .select('transaction.organizationId', 'organizationId')
            .addSelect('transaction.model', 'model')
            .addSelect(
                /*sql*/ `jsonb_build_object(
            'amount', CAST(SUM("transaction"."amountConvert") AS DECIMAL),
            'count', CAST(COUNT(DISTINCT transaction) AS INT)
          ) AS "statistic"`
            )
            .where('transaction.deletedAt IS NULL')

            .groupBy('transaction.organizationId')
            .addGroupBy('transaction.model');

        if (organizationId) {
            query = query.andWhere(
                'transaction.organizationId = :organizationId',
                {
                    organizationId,
                }
            );
        }

        if (days) {
            query = query.andWhere(
                `DATE_TRUNC('day', "transaction"."createdAt") BETWEEN (CURRENT_DATE - INTERVAL '${days} days') AND  CURRENT_DATE`
            );
        }

        const transactions = await query.getRawMany();

        return transactions;
    }

    async findOneBy(
        selections: GetOneTransactionSelections
    ): Promise<Transaction> {
        const { transactionId } = selections;
        let query = this.driver.createQueryBuilder('transaction');

        if (transactionId) {
            query = query.where('transaction.id = :id', { id: transactionId });
        }

        const [error, result] = await useCatch(query.getOne());
        if (error)
            throw new HttpException(
                'transaction not found',
                HttpStatus.NOT_FOUND
            );

        return result;
    }

    /** Create one Transaction to the database. */
    async createOne(options: CreateTransactionOptions): Promise<Transaction> {
        const {
            amount,
            currency,
            title,
            model,
            userBuyerId,
            description,
            organizationId,
            amountConvert,
            token,
            type,
            orderId,
            fullName,
            email,
            userReceiveId,
        } = options;

        const transaction = new Transaction();
        transaction.title = title;
        transaction.model = model;
        transaction.currency = currency;
        transaction.userBuyerId = userBuyerId;
        transaction.amount = amount;
        transaction.type = type;
        transaction.token = token;
        transaction.fullName = fullName;
        transaction.email = email;
        transaction.orderId = orderId;
        transaction.userReceiveId = userReceiveId;
        transaction.color = getRandomElement(colorsArraysTransaction);
        transaction.amountConvert = amountConvert;
        transaction.organizationId = organizationId;
        transaction.description = description;

        const query = this.driver.save(transaction);

        const [error, result] = await useCatch(query);
        if (error) throw new NotFoundException(error);

        return result;
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateNumber } from '../../app/utils/commons/generate-random';
import {
  withPagination,
  WithPaginationResponse,
} from '../../app/utils/pagination/with-pagination';
import { useCatch } from '../../app/utils/use-catch';
import { OrderEvent } from '../../models';
import {
  CreateOrderEventOptions,
  GetOneOrderEventSelections,
  GetOrderEventsSelections,
  UpdateOrderEventOptions,
  UpdateOrderEventSelections,
} from './order-events.type';

@Injectable()
export class OrderEventsService {
  constructor(
    @InjectRepository(OrderEvent)
    private driver: Repository<OrderEvent>,
  ) {}

  async findAll(
    selections: GetOrderEventsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('orderEvent')
      .select('orderEvent.id', 'id')
      .addSelect('orderEvent.code', 'code')
      .addSelect('orderEvent.status', 'status')
      .addSelect('orderEvent.transactionId', 'transactionId')
      .addSelect('orderEvent.title', 'title')
      .addSelect('orderEvent.currency', 'currency')
      .addSelect('orderEvent.priceEvent', 'priceEvent')
      .addSelect('orderEvent.imageEvent', 'imageEvent')
      .addSelect('orderEvent.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `(
        SELECT array_agg(jsonb_build_object(
          'name', "upl"."name",
          'path', "upl"."path"
        )) 
        FROM "upload" "upl"
        WHERE "upl"."uploadableId" = "orderEvent"."id"
        AND "upl"."deletedAt" IS NULL
        AND "upl"."model" IN ('ORDER-EVENT')
        AND "upl"."uploadType" IN ('FILE')
        GROUP BY "orderEvent"."id", "upl"."uploadableId"
        ) AS "uploadsFile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "event"."id",
          'slug', "event"."slug",
          'title', "event"."title",
          'location', "event"."location",
          'currency', "event"."currency",
          'price', "event"."price",
          'address', "event"."address",
          'dateEvent', "event"."dateEvent"
      ) AS "event"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "transaction"."id",
        'token', "transaction"."token"
    ) AS "transaction"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'name', "organization"."name",
              'image', "organization"."image"
          ) AS "organization"`,
      )
      .where('orderEvent.deletedAt IS NULL')
      .leftJoin('orderEvent.ourEvent', 'event')
      .leftJoin('orderEvent.transaction', 'transaction')
      .leftJoin('orderEvent.organization', 'organization');

    if (userId) {
      query = query.andWhere('orderEvent.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('orderEvent.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere('orderEvent.code ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const orderEvents = await query
      .orderBy('orderEvent.createdAt', pagination?.sort)
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany();

    return withPagination({
      pagination,
      rowCount,
      value: orderEvents,
    });
  }

  async findOneBy(selections: GetOneOrderEventSelections): Promise<any> {
    const { orderEventId, organizationId } = selections;
    let query = this.driver
      .createQueryBuilder('orderEvent')
      .select('orderEvent.id', 'id')
      .addSelect('orderEvent.code', 'code')
      .addSelect('orderEvent.status', 'status')
      .addSelect('orderEvent.transactionId', 'transactionId')
      .addSelect('orderEvent.title', 'title')
      .addSelect('orderEvent.currency', 'currency')
      .addSelect('orderEvent.priceEvent', 'priceEvent')
      .addSelect('orderEvent.imageEvent', 'imageEvent')
      .addSelect('orderEvent.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `(
      SELECT array_agg(jsonb_build_object(
        'name', "upl"."name",
        'path', "upl"."path"
      )) 
      FROM "upload" "upl"
      WHERE "upl"."uploadableId" = "orderEvent"."id"
      AND "upl"."deletedAt" IS NULL
      AND "upl"."model" IN ('ORDER-EVENT')
      AND "upl"."uploadType" IN ('FILE')
      GROUP BY "orderEvent"."id", "upl"."uploadableId"
      ) AS "uploadsFile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "event"."id",
        'slug', "event"."slug",
        'title', "event"."title",
        'location', "event"."location",
        'currency', "event"."currency",
        'price', "event"."price",
        'address', "event"."address",
        'dateEvent', "event"."dateEvent"
    ) AS "event"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
      'id', "transaction"."id",
      'token', "transaction"."token"
  ) AS "transaction"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
            'name', "organization"."name",
            'image', "organization"."image"
        ) AS "organization"`,
      )
      .where('orderEvent.deletedAt IS NULL')
      .leftJoin('orderEvent.ourEvent', 'event')
      .leftJoin('orderEvent.transaction', 'transaction')
      .leftJoin('orderEvent.organization', 'organization');

    if (orderEventId) {
      query = query.andWhere('orderEvent.id = :id', {
        id: orderEventId,
      });
    }

    if (organizationId) {
      query = query.andWhere('orderEvent.organizationId = :organizationId', {
        organizationId,
      });
    }

    const result = await query.getRawOne();

    return result;
  }

  /** Create one OrderEvent to the database. */
  async createOne(options: CreateOrderEventOptions): Promise<OrderEvent> {
    const {
      userId,
      title,
      priceEvent,
      transactionId,
      ourEventId,
      imageEvent,
      currency,
      organizationId,
      userConfirmedId,
    } = options;

    const orderEvent = new OrderEvent();
    orderEvent.userId = userId;
    orderEvent.code = generateNumber(16);
    orderEvent.title = title;
    orderEvent.title = title;
    orderEvent.currency = currency;
    orderEvent.priceEvent = priceEvent;
    orderEvent.imageEvent = imageEvent;
    orderEvent.organizationId = organizationId;
    orderEvent.transactionId = transactionId;
    orderEvent.ourEventId = ourEventId;
    orderEvent.userConfirmedId = userConfirmedId;

    const query = this.driver.save(orderEvent);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one OrderEvent to the database. */
  async updateOne(
    selections: UpdateOrderEventSelections,
    options: UpdateOrderEventOptions,
  ): Promise<OrderEvent> {
    const { orderEventId } = selections;
    const { userConfirmedId, status, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('orderEvent');

    if (orderEventId) {
      findQuery = findQuery.where('orderEvent.id = :id', { id: orderEventId });
    }

    const [errorFind, orderEvent] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    orderEvent.status = status;
    orderEvent.deletedAt = deletedAt;
    orderEvent.userConfirmedId = userConfirmedId;

    const query = this.driver.save(orderEvent);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

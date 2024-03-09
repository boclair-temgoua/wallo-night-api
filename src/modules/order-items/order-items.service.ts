import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { useCatch } from '../../app/utils/use-catch';
import { OrderItem } from '../../models';

import { generateNumber } from '../../app/utils/commons';
import {
  CreateOrderItemOptions,
  GetOneOrderItemSelections,
  GetOrderItemsSelections,
  UpdateOrderItemOptions,
  UpdateOrderItemSelections,
} from './order-items.type';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private driver: Repository<OrderItem>,
  ) {}

  async findAll(selections: GetOrderItemsSelections): Promise<any> {
    const {
      search,
      pagination,
      userId,
      orderId,
      model,
      organizationSellerId,
      organizationBuyerId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('orderItem')
      .select('orderItem.id', 'id')
      .addSelect('orderItem.orderNumber', 'orderNumber')
      .addSelect('orderItem.quantity', 'quantity')
      .addSelect('orderItem.percentDiscount', 'percentDiscount')
      .addSelect('orderItem.price', 'price')
      .addSelect('orderItem.priceDiscount', 'priceDiscount')
      .addSelect('orderItem.organizationBuyerId', 'organizationBuyerId')
      .addSelect('orderItem.organizationSellerId', 'organizationSellerId')
      .addSelect('orderItem.model', 'model')
      .addSelect('orderItem.status', 'status')
      .addSelect('orderItem.currency', 'currency')
      .addSelect('orderItem.commissionId', 'commissionId')
      .addSelect('orderItem.productId', 'productId')
      .addSelect('orderItem.orderId', 'orderId')
      .addSelect('orderItem.userId', 'userId')
      .addSelect('orderItem.address', 'address')
      .addSelect('orderItem.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email",
              'username', "user"."username"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'title', "product"."title",
              'slug', "product"."slug",
              'productType', "product"."productType",
              'urlRedirect', "product"."urlRedirect",
              'model', "product"."model",
              'enableUrlRedirect', "product"."enableUrlRedirect",
              'messageAfterPayment', "product"."messageAfterPayment",
              'id', "product"."id"
          ) AS "product"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path",
            'model', "upl"."model",
            'size', "upl"."size",
            'uploadType', "upl"."uploadType"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "product"."id"
          AND "upl"."productId" = "product"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('PRODUCT')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "product"."id", "upl"."uploadableId"
          ) AS "uploadsImages"`,
      )
      .addSelect('orderItem.uploadFiles', 'uploadsFiles')
      // .addSelect(
      //   /*sql*/ `(
      //     SELECT array_agg(jsonb_build_object(
      //       'name', "upl"."name",
      //       'path', "upl"."path",
      //       'model', "upl"."model",
      //       'size', "upl"."size",
      //       'uploadType', "upl"."uploadType"
      //     ))
      //     FROM "upload" "upl"
      //     WHERE "upl"."uploadableId" = "product"."id"
      //     AND "upl"."productId" = "product"."id"
      //     AND "upl"."deletedAt" IS NULL
      //     AND "upl"."model" IN ('PRODUCT')
      //     AND "upl"."uploadType" IN ('FILE')
      //     GROUP BY "product"."id", "upl"."uploadableId"
      //     ) AS "uploadsFiles"`,
      // )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'id', "commission"."id",
              'title', "commission"."title"
          ) AS "commission"`,
      )
      .where('orderItem.deletedAt IS NULL')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('orderItem.product', 'product')
      .leftJoin('orderItem.commission', 'commission')
      .leftJoin('orderItem.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('orderItem.orderNumber ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    if (userId) {
      query = query.andWhere('orderItem.userId = :userId', { userId });
    }

    if (model) {
      query = query.andWhere('orderItem.model = :model', { model });
    }

    if (organizationBuyerId) {
      query = query.andWhere(
        'orderItem.organizationBuyerId = :organizationBuyerId',
        { organizationBuyerId },
      );
    }

    if (organizationSellerId) {
      query = query.andWhere(
        'orderItem.organizationSellerId = :organizationSellerId',
        { organizationSellerId },
      );
    }

    if (orderId) {
      query = query.andWhere('orderItem.orderId = :orderId', { orderId });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const orderProducts = await query
      .orderBy('orderItem.createdAt', pagination?.sort)
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany();

    return withPagination({
      pagination,
      rowCount,
      value: orderProducts,
    });
  }

  async findOneBy(selections: GetOneOrderItemSelections): Promise<OrderItem> {
    const { orderItemId, organizationBuyerId, organizationSellerId } =
      selections;
    let query = this.driver
      .createQueryBuilder('orderItem')
      .where('orderItem.deletedAt IS NULL');

    if (orderItemId) {
      query = query.andWhere('orderItem.id = :id', { id: orderItemId });
    }

    if (organizationBuyerId) {
      query = query.andWhere(
        'orderItem.organizationBuyerId = :organizationBuyerId',
        { organizationBuyerId },
      );
    }

    if (organizationSellerId) {
      query = query.andWhere(
        'orderItem.organizationSellerId = :organizationSellerId',
        { organizationSellerId },
      );
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('orderItem not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create on to the database. */
  async createOne(options: CreateOrderItemOptions): Promise<OrderItem> {
    const {
      userId,
      currency,
      quantity,
      percentDiscount,
      price,
      priceDiscount,
      organizationBuyerId,
      organizationSellerId,
      model,
      status,
      commissionId,
      productId,
      orderId,
      uploadFiles,
    } = options;

    const orderItem = new OrderItem();
    orderItem.userId = userId;
    orderItem.currency = currency;
    orderItem.quantity = quantity;
    orderItem.percentDiscount = percentDiscount;
    orderItem.price = price;
    orderItem.orderNumber = generateNumber(10);
    orderItem.priceDiscount = priceDiscount;
    orderItem.organizationBuyerId = organizationBuyerId;
    orderItem.organizationSellerId = organizationSellerId;
    orderItem.model = model;
    orderItem.status = status;
    orderItem.uploadFiles = uploadFiles;
    orderItem.commissionId = commissionId;
    orderItem.productId = productId;
    orderItem.orderId = orderId;

    const query = this.driver.save(orderItem);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one OrderProduct to the database. */
  async updateOne(
    selections: UpdateOrderItemSelections,
    options: UpdateOrderItemOptions,
  ): Promise<OrderItem> {
    const { orderItemId } = selections;
    const { deletedAt, status } = options;

    let findQuery = this.driver.createQueryBuilder('orderItem');

    if (orderItemId) {
      findQuery = findQuery.where('orderItem.id = :id', {
        id: orderItemId,
      });
    }

    const [errorFind, orderItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    orderItem.status = status;
    orderItem.deletedAt = deletedAt;

    const query = this.driver.save(orderItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

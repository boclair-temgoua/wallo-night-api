import { withPagination } from './../../app/utils/pagination/with-pagination';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from '../../models/OrderProduct';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Brackets, Repository } from 'typeorm';
import {
  CreateOrderProductOptions,
  GetOneOrderProductSelections,
  GetOrderProductsSelections,
  UpdateOrderProductOptions,
  UpdateOrderProductSelections,
} from './order-products.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';

@Injectable()
export class OrderProductsService {
  constructor(
    @InjectRepository(OrderProduct)
    private driver: Repository<OrderProduct>,
  ) {}

  async findAll(selections: GetOrderProductsSelections): Promise<any> {
    const { search, pagination, userId } = selections;

    let query = this.driver
      .createQueryBuilder('orderProduct')
      .select('orderProduct.titleProduct', 'titleProduct')
      .addSelect('orderProduct.id', 'id')
      .addSelect('orderProduct.currency', 'currency')
      .addSelect('orderProduct.discountProduct', 'discountProduct')
      .addSelect('orderProduct.discountCoupon', 'discountCoupon')
      .addSelect('orderProduct.price', 'price')
      .addSelect('orderProduct.priceDiscount', 'priceDiscount')
      .addSelect('orderProduct.discountPercent', 'discountPercent')
      .addSelect('orderProduct.priceTotal', 'priceTotal')
      .addSelect('orderProduct.quantity', 'quantity')
      .addSelect('orderProduct.returnProduct', 'returnProduct')
      .addSelect('orderProduct.userSellerId', 'userSellerId')
      .addSelect('orderProduct.userClientId', 'userClientId')
      .addSelect('orderProduct.clientOrderId', 'clientOrderId')
      .addSelect('orderProduct.userTransportId', 'userTransportId')
      .addSelect('orderProduct.statusConversation', 'statusConversation')
      .addSelect('orderProduct.status', 'status')
      .addSelect('orderProduct.productId', 'productId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "product"."id",
        'slug', "product"."slug"
    ) AS "product"`,
      )
      .where('orderProduct.deletedAt IS NULL')
      .leftJoin('orderProduct.product', 'product');

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('orderProduct.titleProduct ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('orderProduct.price ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, orderProducts] = await useCatch(
      query
        .orderBy('orderProduct.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: orderProducts,
    });
  }

  async findOneBy(
    selections: GetOneOrderProductSelections,
  ): Promise<OrderProduct> {
    const { orderProductId } = selections;
    let query = this.driver
      .createQueryBuilder('orderProduct')
      .select('orderProduct.titleProduct', 'titleProduct')
      .addSelect('orderProduct.id', 'id')
      .addSelect('orderProduct.currency', 'currency')
      .addSelect('orderProduct.discountProduct', 'discountProduct')
      .addSelect('orderProduct.discountCoupon', 'discountCoupon')
      .addSelect('orderProduct.price', 'price')
      .addSelect('orderProduct.priceDiscount', 'priceDiscount')
      .addSelect('orderProduct.discountPercent', 'discountPercent')
      .addSelect('orderProduct.priceTotal', 'priceTotal')
      .addSelect('orderProduct.quantity', 'quantity')
      .addSelect('orderProduct.returnProduct', 'returnProduct')
      .addSelect('orderProduct.userSellerId', 'userSellerId')
      .addSelect('orderProduct.userClientId', 'userClientId')
      .addSelect('orderProduct.clientOrderId', 'clientOrderId')
      .addSelect('orderProduct.userTransportId', 'userTransportId')
      .addSelect('orderProduct.statusConversation', 'statusConversation')
      .addSelect('orderProduct.status', 'status')
      .addSelect('orderProduct.productId', 'productId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "product"."id",
          'slug', "product"."slug"
      ) AS "product"`,
      )
      .where('orderProduct.deletedAt IS NULL')
      .leftJoin('orderProduct.product', 'product');

    if (orderProductId) {
      query = query.andWhere('orderProduct.id = :id', { id: orderProductId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('orderProduct not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one OrderProduct to the database. */
  async createOne(options: CreateOrderProductOptions): Promise<OrderProduct> {
    const {
      titleProduct,
      currency,
      discountProduct,
      discountCoupon,
      price,
      priceDiscount,
      discountPercent,
      priceTotal,
      quantity,
      returnProduct,
      userSellerId,
      userClientId,
      clientOrderId,
      userTransportId,
      statusConversation,
      status,
      productId,
      userId,
    } = options;

    const orderProduct = new OrderProduct();
    orderProduct.titleProduct = titleProduct;
    orderProduct.currency = currency;
    orderProduct.discountProduct = discountProduct;
    orderProduct.discountCoupon = discountCoupon;
    orderProduct.price = price;
    orderProduct.priceDiscount = priceDiscount;
    orderProduct.discountPercent = discountPercent;
    orderProduct.priceTotal = priceTotal;
    orderProduct.quantity = quantity;
    orderProduct.returnProduct = returnProduct;
    orderProduct.userSellerId = userSellerId;
    orderProduct.userClientId = userClientId;
    orderProduct.clientOrderId = clientOrderId;
    orderProduct.userTransportId = userTransportId;
    orderProduct.statusConversation = statusConversation;
    orderProduct.status = status;
    orderProduct.userId = userId;
    orderProduct.productId = productId;

    const query = this.driver.save(orderProduct);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one OrderProduct to the database. */
  async updateOne(
    selections: UpdateOrderProductSelections,
    options: UpdateOrderProductOptions,
  ): Promise<OrderProduct> {
    const { orderProductId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('orderProduct');

    if (orderProductId) {
      findQuery = findQuery.where('orderProduct.id = :id', {
        id: orderProductId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { generateNumber } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Order } from '../../models';
import {
  CreateOrderOptions,
  GetOneOrderSelections,
  GetOrdersSelections,
  UpdateOrderOptions,
  UpdateOrderSelections,
} from './orders.type';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private driver: Repository<Order>,
  ) {}

  async findAll(selections: GetOrdersSelections): Promise<any> {
    const { search, pagination, userId } = selections;

    let query = this.driver
      .createQueryBuilder('order')
      .select('order.id', 'id')
      .addSelect('order.userId', 'userId')
      .addSelect('order.currency', 'currency')
      .addSelect('order.address', 'address')
      .addSelect('order.orderNumber', 'orderNumber')
      .addSelect('order.totalPriceDiscount', 'totalPriceDiscount')
      .addSelect('order.totalPriceNoDiscount', 'totalPriceNoDiscount')
      .where('order.deletedAt IS NULL')
      .leftJoin('order.user', 'user');

    if (userId) {
      query = query.andWhere('order.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('order.orderNumber ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, orderProducts] = await useCatch(
      query
        .orderBy('order.createdAt', pagination?.sort)
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

  async findOneBy(selections: GetOneOrderSelections): Promise<Order> {
    const { orderId } = selections;
    let query = this.driver
      .createQueryBuilder('order')
      .where('order.deletedAt IS NULL');

    if (orderId) {
      query = query.andWhere('order.id = :id', { id: orderId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error) throw new HttpException('order not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create on to the database. */
  async createOne(options: CreateOrderOptions): Promise<Order> {
    const {
      userId,
      currency,
      address,
      totalPriceDiscount,
      totalPriceNoDiscount,
    } = options;

    const order = new Order();
    order.userId = userId;
    order.currency = currency;
    order.address = address;
    order.orderNumber = generateNumber(10);
    order.totalPriceDiscount = totalPriceDiscount;
    order.totalPriceNoDiscount = totalPriceNoDiscount;

    const query = this.driver.save(order);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one OrderProduct to the database. */
  async updateOne(
    selections: UpdateOrderSelections,
    options: UpdateOrderOptions,
  ): Promise<Order> {
    const { orderId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('order');

    if (orderId) {
      findQuery = findQuery.where('order.id = :id', {
        id: orderId,
      });
    }

    const [errorFind, order] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    order.deletedAt = deletedAt;

    const query = this.driver.save(order);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartOrder } from '../../models/CartOrder';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Repository } from 'typeorm';
import {
  CreateCartOrderOptions,
  GetOneCartOrderSelections,
  UpdateCartOrderOptions,
  UpdateCartOrdersSelections,
} from './cart-orders.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';

@Injectable()
export class CartOrdersService {
  constructor(
    @InjectRepository(CartOrder)
    private driver: Repository<CartOrder>,
  ) {}

  async findOneBy(selections: GetOneCartOrderSelections): Promise<CartOrder> {
    const { cartOrderId, userId, organizationId } = selections;
    let query = this.driver
      .createQueryBuilder('cartOrder')
      .select('cartOrder.id', 'id')
      .addSelect('cartOrder.userId', 'userId')
      .addSelect('cartOrder.organizationId', 'organizationId')
      .addSelect('cartOrder.createdAt', 'createdAt')
      .where('cartOrder.deletedAt IS NULL');

    if (cartOrderId) {
      query = query.andWhere('cartOrder.id = :id', { id: cartOrderId });
    }

    if (userId) {
      query = query.andWhere('cartOrder.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('cartOrder.organizationId = :organizationId', {
        organizationId,
      });
    }

    const organization = await query.getRawOne();

    return organization;
  }

  /** Create one CartOrder to the database. */
  async createOne(options: CreateCartOrderOptions): Promise<CartOrder> {
    const { userId, organizationId } = options;

    const cartOrder = new CartOrder();
    cartOrder.userId = userId;
    cartOrder.organizationId = organizationId;

    const query = this.driver.save(cartOrder);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Organization to the database. */
  async updateOne(
    selections: UpdateCartOrdersSelections,
    options: UpdateCartOrderOptions,
  ): Promise<CartOrder> {
    const { cartOrderId } = selections;
    const { userId, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('cartOrder');

    if (cartOrderId) {
      findQuery = findQuery.where('cartOrder.id = :id', {
        id: cartOrderId,
      });
    }

    const [errorFind, cartOrder] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    cartOrder.userId = userId;
    cartOrder.deletedAt = deletedAt;

    const query = this.driver.save(cartOrder);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

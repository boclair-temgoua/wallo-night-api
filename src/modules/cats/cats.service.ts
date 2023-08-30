import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../../models/Cart';
import { Repository, Brackets } from 'typeorm';
import * as Slug from 'slug';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { generateNumber } from '../../app/utils/commons';
import {
  CreateCartsOptions,
  GetOneCartsSelections,
  GetCartsSelections,
  UpdateCartsOptions,
  UpdateCartsSelections,
} from './cats.type';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private driver: Repository<Cart>,
  ) {}

  async findAll(selections: GetCartsSelections): Promise<any> {
    const { userId, productId, status } = selections;

    let query = this.driver
      .createQueryBuilder('cart')
      .select('cart.id', 'id')
      .addSelect('cart.quantity', 'quantity')
      .addSelect('cart.productId', 'productId')
      .addSelect('cart.userId', 'userId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
            'enableExpiredAt', "discount"."enableExpiredAt",
            'expiredAt', "discount"."expiredAt",
            'percent', "discount"."percent",
            'isValid', CASE WHEN ("discount"."expiredAt" >= now()::date
            AND "discount"."deletedAt" IS NULL
            AND "discount"."enableExpiredAt" IS TRUE) THEN true 
            WHEN ("discount"."expiredAt" < now()::date
            AND "discount"."deletedAt" IS NULL
            AND "discount"."enableExpiredAt" IS TRUE) THEN false
            ELSE true
            END
        ) AS "discount"`,
      )
      // .addSelect(
      //   /*sql*/ `
      //     CASE
      //     WHEN ("discount"."expiredAt" >= now()::date
      //     AND "discount"."deletedAt" IS NULL
      //     AND "discount"."enableExpiredAt" IS TRUE
      //     AND "product"."enableDiscount" IS TRUE) THEN
      //     CAST(("product"."price" - ("product"."price" * "discount"."percent") / 100) AS INT)
      //     WHEN ("discount"."deletedAt" IS NULL
      //     AND "discount"."enableExpiredAt" IS FALSE
      //     AND "product"."enableDiscount" IS TRUE) THEN
      //     CAST(("product"."price" - ("product"."price" * "discount"."percent") / 100) AS INT)
      //     ELSE "product"."price"
      //     END
      // `,
      //   'priceDiscount',
      // )
      // .addSelect(
      //   /*sql*/ `jsonb_build_object(
      //     'id', "product"."id",
      //     'title', "product"."title",
      //     'description', "product"."description",
      //     'slug', "product"."slug",
      //     'priceNoDiscount', "product"."price",
      //     'price',  CASE 
      //     WHEN ("discount"."expiredAt" >= now()::date 
      //     AND "discount"."deletedAt" IS NULL
      //     AND "discount"."isActive" IS TRUE) THEN  
      //     CAST(("product"."price" - ("product"."price" * "discount"."percent") / 100) AS INT)
      //     WHEN ("discount"."expiredAt" < now()::date
      //     AND "discount"."deletedAt" IS NULL
      //     AND "discount"."isActive" IS TRUE) THEN "product"."price"
      //     ELSE "product"."price"
      //     END, 
      //     'category', jsonb_build_object(
      //       'slug', "category"."slug",
      //       'name', "category"."name",
      //       'color', "category"."color"
      //       ),
      //     'currency', jsonb_build_object(
      //       'code', "currency"."code",
      //       'symbol', "currency"."symbol"
      //       )
      // ) AS "product"`,
      // )
      .addSelect('cart.createdAt', 'createdAt')
      .where('cart.deletedAt IS NULL')
      .leftJoin('cart.product', 'product')
      .leftJoin('product.currency', 'currency')
      .leftJoin('product.category', 'category')
      .leftJoin('product.discount', 'discount');

    if (status) {
      query = query.andWhere('cart.status = :status', {
        status,
      });
    }

    if (userId) {
      query = query.andWhere('cart.userId = :userId', {
        userId,
      });
    }

    if (productId) {
      query = query.andWhere('cart.productId = :productId', {
        productId,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, carts] = await useCatch(
      query.orderBy('cart.createdAt', 'ASC').getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    const totalPrice = carts.reduce(
      (total, item) => total + Number(item?.product?.price),
      0,
    );
    const totalQuantity = carts.reduce(
      (total, item) => total + Number(item.quantity),
      0,
    );

    const totalPriceWithCurrency = `${totalPrice} ${carts[0].product?.currency?.symbol}`;

    return {
      summary: {
        totalQuantity: totalQuantity,
        totalPrice: totalPrice,
        totalPriceWithCurrency,
      },
      cart_items: carts,
    };
  }

  async findOneBy(selections: GetOneCartsSelections): Promise<Cart> {
    const { cartId, userId, productId, status } = selections;
    let query = this.driver
      .createQueryBuilder('cart')
      .select('cart.id', 'id')
      .addSelect('cart.quantity', 'quantity')
      .addSelect('cart.productId', 'productId')
      .addSelect('cart.userId', 'userId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "product"."id",
          'title', "product"."title",
          'price', "product"."price",
          'description', "product"."description",
          'slug', "product"."slug",
          'currency', jsonb_build_object(
            'code', "currency"."code",
            'symbol', "currency"."symbol"
            )
      ) AS "product"`,
      )
      .addSelect('cart.createdAt', 'createdAt')
      .where('cart.deletedAt IS NULL')
      .leftJoin('cart.product', 'product')
      .leftJoin('product.currency', 'currency')
      .leftJoin('product.category', 'category')
      .leftJoin('product.discount', 'discount');

    if (cartId) {
      query = query.andWhere('cart.id = :id', { id: cartId });
    }

    if (status) {
      query = query.andWhere('cart.status = :status', {
        status,
      });
    }

    if (userId) {
      query = query.andWhere('cart.userId = :userId', { userId });
    }

    if (productId) {
      query = query.andWhere('cart.productId = :productId', { productId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('cart not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Carts to the database. */
  async createOne(options: CreateCartsOptions): Promise<Cart> {
    const { userId, quantity, productId } = options;

    const cart = new Cart();
    cart.userId = userId;
    cart.quantity = quantity;
    cart.productId = productId;
    const query = this.driver.save(cart);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Carts to the database. */
  async updateOne(
    selections: UpdateCartsSelections,
    options: UpdateCartsOptions,
  ): Promise<Cart> {
    const { cartId } = selections;
    const { quantity, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('cart');

    if (cartId) {
      findQuery = findQuery.where('cart.id = :id', { id: cartId });
    }

    const [errorFind, cart] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    cart.quantity = quantity;
    cart.deletedAt = deletedAt;

    const query = this.driver.save(cart);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

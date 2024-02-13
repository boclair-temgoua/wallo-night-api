import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import { Cart } from '../../models/Cart';
import {
  CartResponse,
  CreateCartsOptions,
  GetCartsSelections,
  GetOneCartsSelections,
  UpdateCartsOptions,
  UpdateCartsSelections,
} from './cats.type';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private driver: Repository<Cart>,
  ) {}

  async findAll(selections: GetCartsSelections): Promise<CartResponse> {
    const {
      userId,
      productId,
      status,
      cartOrderId,
      ipLocation,
      currency,
      organizationSellerId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('cart')
      .select('cart.id', 'id')
      .addSelect('cart.quantity', 'quantity')
      .addSelect('cart.productId', 'productId')
      .addSelect('cart.userId', 'userId')
      .addSelect('cart.model', 'model')
      .addSelect('cart.organizationSellerId', 'organizationSellerId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'fullName', "profile"."fullName",
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'image', "profile"."image",
          'color', "profile"."color",
          'userId', "user"."id",
          'username', "user"."username"
          ) AS "profileVendor"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path",
            'model', "upl"."model",
            'uploadType', "upl"."uploadType"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "product"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('PRODUCT')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "product"."id", "upl"."uploadableId"
          ) AS "uploadsImages"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT array_agg(jsonb_build_object(
            'name', "upl"."name",
            'path', "upl"."path",
            'model', "upl"."model",
            'uploadType', "upl"."uploadType"
          )) 
          FROM "upload" "upl"
          WHERE "upl"."uploadableId" = "product"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('PRODUCT')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "product"."id", "upl"."uploadableId"
          ) AS "uploadsFiles"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'id', "product"."id",
              'title', "product"."title",
              'slug', "product"."slug",
              'productType', "product"."productType",
              'price', "product"."price",
              'organizationId', "product"."organizationId",
              'currency', jsonb_build_object(
                'symbol', "currency"."symbol",
                'name', "currency"."name",
                'code', "currency"."code"
              ),
              'priceDiscount', CASE
              WHEN ("discount"."expiredAt" >= now()::date
              AND "discount"."deletedAt" IS NULL
              AND "discount"."enableExpiredAt" IS TRUE
              AND "product"."enableDiscount" IS TRUE) THEN
              CAST(("product"."price" - ("product"."price" * "discount"."percent") / 100) AS INT)
              WHEN ("discount"."deletedAt" IS NULL
              AND "discount"."enableExpiredAt" IS FALSE
              AND "product"."enableDiscount" IS TRUE) THEN
              CAST(("product"."price" - ("product"."price" * "discount"."percent") / 100) AS INT)
              ELSE "product"."price"
              END,
              'discount', jsonb_build_object(
                'enableExpiredAt', "discount"."enableExpiredAt",
                'expiredAt', "discount"."expiredAt",
                'percent', "discount"."percent",
                'isValid', CASE WHEN ("discount"."expiredAt" >= now()::date
                AND "discount"."deletedAt" IS NULL
                OR "discount"."expiredAt" IS NULL) THEN true 
                WHEN ("discount"."expiredAt" < now()::date
                AND "discount"."deletedAt" IS NULL) THEN false
                ELSE false
                END
            )
          ) AS "product"`,
      )
      .addSelect('cart.createdAt', 'createdAt')
      .where('cart.deletedAt IS NULL')
      .andWhere('product.deletedAt IS NULL')
      .leftJoin('cart.product', 'product')
      .leftJoin('product.currency', 'currency')
      .leftJoin('product.category', 'category')
      .leftJoin('product.discount', 'discount')
      .leftJoin('product.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (status) {
      query = query.andWhere('cart.status = :status', {
        status,
      });
    }

    if (cartOrderId) {
      query = query.andWhere('cart.cartOrderId = :cartOrderId', {
        cartOrderId,
      });
    }

    if (ipLocation) {
      query = query.andWhere('cart.ipLocation = :ipLocation', { ipLocation });
    }

    if (currency) {
      query = query.andWhere('cart.currency = :currency', { currency });
    }

    if (organizationSellerId) {
      query = query.andWhere(
        'cart.organizationSellerId = :organizationSellerId',
        {
          organizationSellerId,
        },
      );
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

    const carts = await query.orderBy('cart.createdAt', 'DESC').getRawMany();
    const totalPriceDiscount = carts?.reduce(
      (acc, item) =>
        acc + Number(item?.product?.priceDiscount) * Number(item?.quantity),
      0,
    );
    const totalPriceNoDiscount = carts?.reduce(
      (acc, item) =>
        acc + Number(item?.product?.price) * Number(item?.quantity),
      0,
    );
    const totalQuantity = carts?.reduce(
      (acc, item) => acc + Number(item?.quantity),
      0,
    );

    // const totalPriceWithCurrency = `${totalPrice} ${carts[0].product?.currency?.symbol}`;

    return {
      summary: {
        totalQuantity: totalQuantity ?? 0,
        totalPriceDiscount: totalPriceDiscount ?? 0,
        totalPriceNoDiscount: totalPriceNoDiscount ?? 0,
        currency: carts[0]?.product?.currency?.code ?? '',
        userId: carts[0]?.userId ?? '',
      },
      cartItems: carts,
    };
  }

  async findOneBy(selections: GetOneCartsSelections): Promise<Cart> {
    const {
      cartId,
      userId,
      productId,
      cartOrderId,
      organizationSellerId,
      currency,
      status,
    } = selections;
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

    if (cartOrderId) {
      query = query.andWhere('cart.cartOrderId = :cartOrderId', {
        cartOrderId,
      });
    }

    if (currency) {
      query = query.andWhere('cart.currency = :currency', { currency });
    }

    if (status) {
      query = query.andWhere('cart.status = :status', {
        status,
      });
    }

    if (organizationSellerId) {
      query = query.andWhere(
        'cart.organizationSellerId = :organizationSellerId',
        {
          organizationSellerId,
        },
      );
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
    const {
      userId,
      quantity,
      ipLocation,
      cartOrderId,
      organizationSellerId,
      productId,
      currency,
      model,
    } = options;

    const cart = new Cart();
    cart.userId = userId;
    cart.quantity = quantity;
    cart.productId = productId;
    cart.currency = currency;
    cart.model = model;
    cart.ipLocation = ipLocation;
    cart.cartOrderId = cartOrderId;
    cart.organizationSellerId = organizationSellerId;
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
    const { quantity, status, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('cart');

    if (cartId) {
      findQuery = findQuery.where('cart.id = :id', { id: cartId });
    }

    const [errorFind, cart] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    cart.status = status;
    cart.quantity = quantity;
    cart.deletedAt = deletedAt;

    const query = this.driver.save(cart);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

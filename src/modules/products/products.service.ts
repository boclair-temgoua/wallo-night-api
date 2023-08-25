import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../models/Product';
import { Repository, Brackets } from 'typeorm';
import * as Slug from 'slug';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { generateNumber } from '../../app/utils/commons';
import {
  CreateProductsOptions,
  GetOneProductsSelections,
  GetProductsSelections,
  UpdateProductsOptions,
  UpdateProductsSelections,
} from './products.type';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private driver: Repository<Product>,
  ) {}

  async findAll(selections: GetProductsSelections): Promise<any> {
    const { search, pagination } = selections;

    let query = this.driver
      .createQueryBuilder('product')
      .select('product.id', 'id')
      .addSelect('product.title', 'title')
      .addSelect('product.subTitle', 'subTitle')
      .addSelect('product.slug', 'slug')
      .addSelect('product.sku', 'sku')
      .addSelect('product.urlMedia', 'urlMedia')
      .addSelect('product.messageAfterPurchase', 'messageAfterPurchase')
      .addSelect('product.description', 'description')
      .addSelect('product.moreDescription', 'moreDescription')
      .addSelect('product.inventory', 'inventory')
      .addSelect('product.status', 'status')
      .addSelect('product.userCreatedId', 'userCreatedId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'symbol', "currency"."symbol",
        'name', "currency"."name",
        'code', "currency"."code"
    ) AS "currency"`,
      )
    //   .addSelect(
    //     /*sql*/ `jsonb_build_object(
    //     'slug', "category"."slug",
    //     'name', "category"."name",
    //     'color', "category"."color"
    // ) AS "category"`,
    //   )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'startedAt', "discount"."startedAt",
        'expiredAt', "discount"."expiredAt",
        'percent', "discount"."percent",
        'isValid', CASE 
        WHEN ("discount"."expiredAt" >= now()::date 
        AND "discount"."deletedAt" IS NULL
        AND "discount"."isActive" IS TRUE) THEN true
        WHEN ("discount"."expiredAt" < now()::date
        AND "discount"."deletedAt" IS NULL
        AND "discount"."isActive" IS TRUE) THEN false
        ELSE false
        END
    ) AS "discount"`,
      )
      .addSelect(
        /*sql*/ `
      CASE 
      WHEN ("discount"."expiredAt" >= now()::date 
      AND "discount"."deletedAt" IS NULL
      AND "discount"."isActive" IS TRUE) THEN  
      CAST(("product"."price" - ("product"."price" * "discount"."percent") / 100) AS INT)
      WHEN ("discount"."expiredAt" < now()::date
      AND "discount"."deletedAt" IS NULL
      AND "discount"."isActive" IS TRUE) THEN "product"."price"
      ELSE "product"."price"
      END
  `,
        'price',
      )
      .addSelect('product.price', 'priceNoDiscount')
      .addSelect('product.createdAt', 'createdAt')
      .where('product.deletedAt IS NULL')
      .leftJoin('product.category', 'category')
      .leftJoin('product.currency', 'currency')
      .leftJoin('product.discount', 'discount');

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('product.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('product.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, products] = await useCatch(
      query
        .orderBy('product.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: products,
    });
  }

  async findOneBy(selections: GetOneProductsSelections): Promise<Product> {
    const { productId, productSlug, userId } = selections;
    let query = this.driver
      .createQueryBuilder('product')
      .select('product.id', 'id')
      .addSelect('product.title', 'title')
      .addSelect('product.subTitle', 'subTitle')
      .addSelect('product.slug', 'slug')
      .addSelect('product.userId', 'userId')
      .addSelect('product.urlMedia', 'urlMedia')
      .addSelect('product.messageAfterPurchase', 'messageAfterPurchase')
      .addSelect('product.sku', 'sku')
      .addSelect('product.description', 'description')
      .addSelect('product.moreDescription', 'moreDescription')
      .addSelect('product.inventory', 'inventory')
      .addSelect('product.status', 'status')
      .addSelect(
        /*sql*/ `jsonb_build_object(
            'symbol', "currency"."symbol",
            'name', "currency"."name",
            'code', "currency"."code"
        ) AS "currency"`,
      )
      // .addSelect(
      //   /*sql*/ `jsonb_build_object(
      //       'name', "category"."name",
      //       'color', "category"."color"
      //   ) AS "category"`,
      // )
      // .addSelect(
      //   /*sql*/ `jsonb_build_object(
      //       'startedAt', "discount"."startedAt",
      //       'expiredAt', "discount"."expiredAt",
      //       'percent', "discount"."percent",
      //       'isValid', CASE
      //       WHEN ("discount"."expiredAt" >= now()::date
      //       AND "discount"."deletedAt" IS NULL
      //       AND "discount"."isActive" IS TRUE) THEN true
      //       WHEN ("discount"."expiredAt" < now()::date
      //       AND "discount"."deletedAt" IS NULL
      //       AND "discount"."isActive" IS TRUE) THEN false
      //       ELSE false
      //       END
      //   ) AS "discount"`,
      // )
      // .addSelect(
      //   /*sql*/ `
      //     CASE
      //     WHEN ("discount"."expiredAt" >= now()::date
      //     AND "discount"."deletedAt" IS NULL
      //     AND "discount"."isActive" IS TRUE) THEN
      //     CAST(("product"."price" - ("product"."price" * "discount"."percent") / 100) AS INT)
      //     WHEN ("discount"."expiredAt" < now()::date
      //     AND "discount"."deletedAt" IS NULL
      //     AND "discount"."isActive" IS TRUE) THEN "product"."price"
      //     ELSE "product"."price"
      //     END
      // `,
      //   'price',
      // )
      .addSelect('product.price', 'priceNoDiscount')
      .addSelect('product.createdAt', 'createdAt')
      .where('product.deletedAt IS NULL')
      .leftJoin('product.category', 'category')
      .leftJoin('product.currency', 'currency')
      .leftJoin('product.discount', 'discount');

    if (productId) {
      query = query.andWhere('product.id = :id', { id: productId });
    }

    if (userId) {
      query = query.andWhere('product.userId = :userId', { userId });
    }

    if (productSlug) {
      query = query.andWhere('product.slug = :slug', { slug: productSlug });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Products to the database. */
  async createOne(options: CreateProductsOptions): Promise<Product> {
    const {
      title,
      subTitle,
      sku,
      price,
      description,
      moreDescription,
      inventory,
      status,
      currencyId,
      categoryId,
      discountId,
      urlMedia,
      messageAfterPurchase,
      userId,
    } = options;

    const product = new Product();
    product.title = title;
    product.price = price;
    product.sku = sku;
    product.subTitle = subTitle;
    product.moreDescription = moreDescription;
    product.inventory = inventory;
    product.categoryId = categoryId;
    product.status = status;
    product.discountId = discountId;
    product.currencyId = currencyId;
    product.messageAfterPurchase = messageAfterPurchase;
    product.urlMedia = urlMedia;
    product.slug = `${Slug(title)}-${generateNumber(4)}`;
    product.description = description;
    product.userId = userId;

    const query = this.driver.save(product);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Products to the database. */
  async updateOne(
    selections: UpdateProductsSelections,
    options: UpdateProductsOptions,
  ): Promise<Product> {
    const { productId } = selections;
    const {
      title,
      subTitle,
      sku,
      price,
      description,
      moreDescription,
      inventory,
      status,
      discountId,
      currencyId,
      categoryId,
      deletedAt,
      urlMedia,
      messageAfterPurchase
    } = options;

    let findQuery = this.driver.createQueryBuilder('product');

    if (productId) {
      findQuery = findQuery.where('product.id = :id', { id: productId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.price = price;
    findItem.sku = sku;
    findItem.subTitle = subTitle;
    findItem.moreDescription = moreDescription;
    findItem.inventory = inventory;
    findItem.status = status;
    findItem.categoryId = categoryId;
    findItem.currencyId = currencyId;
    findItem.discountId = discountId;
    findItem.messageAfterPurchase = messageAfterPurchase;
    findItem.urlMedia = urlMedia;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

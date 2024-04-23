import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Slug, generateNumber, isNotUndefined } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Product } from '../../models/Product';
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
        private driver: Repository<Product>
    ) {}

    async findAll(selections: GetProductsSelections): Promise<any> {
        const {
            search,
            pagination,
            enableVisibility,
            status,
            modelIds,
            organizationId,
        } = selections;

        let query = this.driver
            .createQueryBuilder('product')
            .select('product.id', 'id')
            .addSelect('product.title', 'title')
            .addSelect('product.subTitle', 'subTitle')
            .addSelect('product.slug', 'slug')
            .addSelect('product.productType', 'productType')
            .addSelect('product.userId', 'userId')
            .addSelect('product.urlMedia', 'urlMedia')
            .addSelect('product.expiredAt', 'expiredAt')
            .addSelect('product.messageAfterPayment', 'messageAfterPayment')
            .addSelect('product.sku', 'sku')
            .addSelect('product.description', 'description')
            .addSelect('product.moreDescription', 'moreDescription')
            .addSelect('product.status', 'status')
            .addSelect('product.limitSlot', 'limitSlot')
            .addSelect('product.urlRedirect', 'urlRedirect')
            .addSelect('product.enableUrlRedirect', 'enableUrlRedirect')
            .addSelect('product.price', 'price')
            .addSelect('product.categoryId', 'categoryId')
            .addSelect('product.enableLimitSlot', 'enableLimitSlot')
            .addSelect('product.enableDiscount', 'enableDiscount')
            .addSelect('product.discountId', 'discountId')
            .addSelect('product.organizationId', 'organizationId')
            .addSelect('product.model', 'model')
            .addSelect('product.address', 'address')
            .addSelect('product.city', 'city')
            .addSelect('product.countryId', 'countryId')
            .addSelect('product.enableComment', 'enableComment')
            .addSelect('product.enableVisibility', 'enableVisibility')
            .addSelect('product.enableChooseQuantity', 'enableChooseQuantity')
            .addSelect(
                /*sql*/ `jsonb_build_object(
            'code', "country"."code",
            'name', "country"."name"
        ) AS "country"`
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
            'symbol', "currency"."symbol",
            'name', "currency"."name",
            'code', "currency"."code"
        ) AS "currency"`
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
            'id', "category"."id",
            'name', "category"."name",
            'slug', "category"."slug",
            'color', "category"."color"
        ) AS "category"`
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'username', "user"."username"
          ) AS "profile"`
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
          AND "upl"."model" IN ('PRODUCT','EVENT')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "product"."id", "upl"."uploadableId"
          ) AS "uploadsImages"`
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
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "product"."id", "upl"."uploadableId"
          ) AS "uploadsFiles"`
            )
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
            ELSE false
            END
        ) AS "discount"`
            )
            .addSelect(
                /*sql*/ `
          CASE
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
          END
      `,
                'priceDiscount'
            )
            .addSelect('product.createdAt', 'createdAt')
            .where('product.deletedAt IS NULL')
            .leftJoin('product.category', 'category')
            .leftJoin('product.currency', 'currency')
            .leftJoin('product.country', 'country')
            .leftJoin('product.discount', 'discount')
            .leftJoin('product.organization', 'organization')
            .leftJoin('organization.user', 'user')
            .leftJoin('user.profile', 'profile');

        if (modelIds && modelIds.length > 0) {
            query = query.andWhere('product.model IN (:...modelIds)', {
                modelIds,
            });
        }

        if (organizationId) {
            query = query.andWhere('product.organizationId = :organizationId', {
                organizationId,
            });
        }

        if (enableVisibility) {
            query = query.andWhere(
                'product.enableVisibility = :enableVisibility',
                {
                    enableVisibility: true,
                }
            );
        }

        if (status) {
            query = query.andWhere('product.status = :status', { status });
        }

        if (search) {
            query = query.andWhere(
                new Brackets((qb) => {
                    qb.where('product.title ::text ILIKE :search', {
                        search: `%${search}%`,
                    }).orWhere('product.description ::text ILIKE :search', {
                        search: `%${search}%`,
                    });
                })
            );
        }

        const [errorRowCount, rowCount] = await useCatch(query.getCount());
        if (errorRowCount) throw new NotFoundException(errorRowCount);

        const products = await query
            .orderBy('product.createdAt', pagination?.sort)
            .limit(pagination.limit)
            .offset(pagination.offset)
            .getRawMany();

        return withPagination({
            pagination,
            rowCount,
            value: products,
        });
    }

    async findOneBy(selections: GetOneProductsSelections): Promise<any> {
        const { productId, enableVisibility, productSlug, organizationId } =
            selections;
        let query = this.driver
            .createQueryBuilder('product')
            .select('product.id', 'id')
            .addSelect('product.title', 'title')
            .addSelect('product.subTitle', 'subTitle')
            .addSelect('product.slug', 'slug')
            .addSelect('product.userId', 'userId')
            .addSelect('product.urlMedia', 'urlMedia')
            .addSelect('product.productType', 'productType')
            .addSelect('product.messageAfterPayment', 'messageAfterPayment')
            .addSelect('product.sku', 'sku')
            .addSelect('product.expiredAt', 'expiredAt')
            .addSelect('product.description', 'description')
            .addSelect('product.moreDescription', 'moreDescription')
            .addSelect('product.limitSlot', 'limitSlot')
            .addSelect('product.urlRedirect', 'urlRedirect')
            .addSelect('product.enableUrlRedirect', 'enableUrlRedirect')
            .addSelect('product.status', 'status')
            .addSelect('product.price', 'price')
            .addSelect('product.categoryId', 'categoryId')
            .addSelect('product.enableLimitSlot', 'enableLimitSlot')
            .addSelect('product.enableDiscount', 'enableDiscount')
            .addSelect('product.discountId', 'discountId')
            .addSelect('product.organizationId', 'organizationId')
            .addSelect('product.organizationId', 'organizationId')
            .addSelect('product.model', 'model')
            .addSelect('product.address', 'address')
            .addSelect('product.city', 'city')
            .addSelect('product.countryId', 'countryId')
            .addSelect('product.enableComment', 'enableComment')
            .addSelect('product.enableVisibility', 'enableVisibility')
            .addSelect('product.enableChooseQuantity', 'enableChooseQuantity')
            .addSelect(
                /*sql*/ `jsonb_build_object(
            'code', "country"."code",
            'name', "country"."name"
        ) AS "country"`
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
            'symbol', "currency"."symbol",
            'name', "currency"."name",
            'code', "currency"."code"
        ) AS "currency"`
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
            'id', "category"."id",
            'name', "category"."name",
            'slug', "category"."slug",
            'color', "category"."color"
        ) AS "category"`
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'username', "user"."username"
          ) AS "profile"`
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
          AND "upl"."productId" = "product"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('PRODUCT','EVENT')
          AND "upl"."uploadType" IN ('IMAGE')
          GROUP BY "product"."id", "upl"."uploadableId"
          ) AS "uploadsImages"`
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
          AND "upl"."productId" = "product"."id"
          AND "upl"."deletedAt" IS NULL
          AND "upl"."model" IN ('PRODUCT')
          AND "upl"."uploadType" IN ('FILE')
          GROUP BY "product"."id", "upl"."uploadableId"
          ) AS "uploadsFiles"`
            )
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
            ELSE false
            END
        ) AS "discount"`
            )
            .addSelect(
                /*sql*/ `
          CASE
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
          END
      `,
                'priceDiscount'
            )
            .addSelect('product.createdAt', 'createdAt')
            .where('product.deletedAt IS NULL')
            .leftJoin('product.country', 'country')
            .leftJoin('product.category', 'category')
            .leftJoin('product.currency', 'currency')
            .leftJoin('product.discount', 'discount')
            .leftJoin('product.organization', 'organization')
            .leftJoin('organization.user', 'user')
            .leftJoin('user.profile', 'profile');

        if (productId) {
            query = query.andWhere('product.id = :id', { id: productId });
        }

        if (organizationId) {
            query = query.andWhere('product.organizationId = :organizationId', {
                organizationId,
            });
        }

        if (enableVisibility) {
            query = query.andWhere(
                'product.enableVisibility = :enableVisibility',
                {
                    enableVisibility: true,
                }
            );
        }

        if (productSlug) {
            query = query.andWhere('product.slug = :slug', {
                slug: productSlug,
            });
        }

        const products = await query.getRawOne();

        return products;
    }

    /** Create one Products to the database. */
    async createOne(options: CreateProductsOptions): Promise<Product> {
        const {
            title,
            subTitle,
            sku,
            price,
            model,
            description,
            moreDescription,
            limitSlot,
            status,
            currencyId,
            categoryId,
            discountId,
            urlMedia,
            productType,
            urlRedirect,
            enableLimitSlot,
            enableDiscount,
            organizationId,
            enableUrlRedirect,
            messageAfterPayment,
            enableChooseQuantity,
            userId,
            expiredAt,
            enableVisibility,
            enableComment,
            city,
            address,
            countryId,
        } = options;

        const product = new Product();
        product.title = title;
        product.price = price;
        product.sku = sku;
        product.model = model;
        product.productType = productType;
        product.urlRedirect = urlRedirect;
        product.enableUrlRedirect = enableUrlRedirect;
        product.subTitle = subTitle;
        product.moreDescription = moreDescription;
        product.limitSlot = limitSlot;
        product.status = status;
        product.address = address;
        product.countryId = countryId;
        product.city = city;
        product.currencyId = currencyId;
        product.organizationId = organizationId;
        product.enableLimitSlot = enableLimitSlot;
        product.enableDiscount = enableDiscount;
        product.enableChooseQuantity = enableChooseQuantity;
        product.messageAfterPayment = messageAfterPayment;
        product.urlMedia = urlMedia;
        product.expiredAt = new Date(expiredAt);
        product.slug = `${Slug(title)}-${generateNumber(4)}`;
        product.description = description;
        product.userId = userId;
        product.enableVisibility = enableVisibility;
        product.enableComment = enableComment;
        product.discountId = isNotUndefined(discountId) ? discountId : null;
        product.categoryId = isNotUndefined(categoryId) ? categoryId : null;

        const query = this.driver.save(product);

        const [error, result] = await useCatch(query);
        if (error) throw new NotFoundException(error);

        return result;
    }

    /** Update one Products to the database. */
    async updateOne(
        selections: UpdateProductsSelections,
        options: UpdateProductsOptions
    ): Promise<Product> {
        const { productId } = selections;
        const {
            title,
            subTitle,
            sku,
            model,
            price,
            description,
            moreDescription,
            status,
            discountId,
            currencyId,
            categoryId,
            deletedAt,
            productType,
            urlMedia,
            limitSlot,
            urlRedirect,
            enableUrlRedirect,
            enableLimitSlot,
            enableDiscount,
            enableComment,
            expiredAt,
            city,
            address,
            countryId,
            enableVisibility,
            messageAfterPayment,
            enableChooseQuantity,
        } = options;

        let findQuery = this.driver.createQueryBuilder('product');

        if (productId) {
            findQuery = findQuery.where('product.id = :id', { id: productId });
        }

        const [errorFind, product] = await useCatch(findQuery.getOne());
        if (errorFind) throw new NotFoundException(errorFind);

        product.title = title;
        product.price = price;
        product.sku = sku;
        product.model = model;
        product.subTitle = subTitle;
        product.moreDescription = moreDescription;
        product.status = status;
        product.productType = productType;
        product.currencyId = currencyId;
        product.limitSlot = limitSlot;
        product.urlRedirect = urlRedirect;
        product.enableUrlRedirect = enableUrlRedirect;
        product.enableLimitSlot = enableLimitSlot;
        product.enableDiscount = enableDiscount;
        product.enableChooseQuantity = enableChooseQuantity;
        product.messageAfterPayment = messageAfterPayment;
        product.urlMedia = urlMedia;
        product.address = address;
        product.countryId = countryId;
        product.city = city;
        product.expiredAt = new Date(expiredAt);
        product.enableVisibility = enableVisibility;
        product.enableComment = enableComment;
        product.description = description;
        product.deletedAt = deletedAt;
        product.discountId = isNotUndefined(discountId) ? discountId : null;
        product.categoryId = isNotUndefined(categoryId) ? categoryId : null;

        const query = this.driver.save(product);

        const [errorUp, result] = await useCatch(query);
        if (errorUp) throw new NotFoundException(errorUp);

        return result;
    }
}

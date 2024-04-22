import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { generateLongUUID } from '../../app/utils/commons';
import {
    WithPaginationResponse,
    withPagination,
} from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Affiliation } from '../../models';
import {
    CreateAffiliationsOptions,
    GetAffiliationsSelections,
    GetOneAffiliationsSelections,
    UpdateAffiliationsOptions,
    UpdateAffiliationsSelections,
} from './affiliations.type';

@Injectable()
export class AffiliationsService {
    constructor(
        @InjectRepository(Affiliation)
        private driver: Repository<Affiliation>
    ) {}

    async findAll(
        selections: GetAffiliationsSelections
    ): Promise<WithPaginationResponse | null> {
        const {
            search,
            pagination,
            productId,
            userReceivedId,
            organizationSellerId,
            organizationReceivedId,
        } = selections;

        let query = this.driver
            .createQueryBuilder('affiliation')
            .select('affiliation.id', 'id')
            .addSelect('affiliation.url', 'url')
            .addSelect('affiliation.email', 'email')
            .addSelect('affiliation.code', 'code')
            .addSelect('affiliation.percent', 'percent')
            .addSelect('affiliation.description', 'description')
            .addSelect('affiliation.expiredAt', 'expiredAt')
            .addSelect('affiliation.productId', 'productId')
            .addSelect('affiliation.createdAt', 'createdAt')
            .addSelect(
                'affiliation.organizationSellerId',
                'organizationSellerId'
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
          'title', "product"."title",
          'slug', "product"."slug"
          ) AS "product"`
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
                'fullName', "profile"."fullName",
                'firstName', "profile"."firstName",
                'lastName', "profile"."lastName",
                'email', "user"."email",
                'image', "profile"."image",
                'color', "profile"."color",
                'userId', "user"."id",
                'username', "user"."username"
            ) AS "profile"`
            )
            .where('affiliation.deletedAt IS NULL')
            .leftJoin('affiliation.product', 'product')
            .leftJoin('affiliation.user', 'user')
            .leftJoin('user.profile', 'profile');

        if (productId) {
            query = query.andWhere('affiliation.productId = :productId', {
                productId,
            });
        }

        if (organizationSellerId) {
            query = query.andWhere(
                'affiliation.organizationSellerId = :organizationSellerId',
                {
                    organizationSellerId,
                }
            );
        }

        if (userReceivedId) {
            query = query.andWhere(
                'affiliation.userReceivedId = :userReceivedId',
                {
                    userReceivedId,
                }
            );
        }

        if (organizationReceivedId) {
            query = query.andWhere(
                'affiliation.organizationReceivedId = :organizationReceivedId',
                {
                    organizationReceivedId,
                }
            );
        }

        if (search) {
            query = query.andWhere(
                new Brackets((qb) => {
                    qb.where('product.title ::text ILIKE :search', {
                        search: `%${search}%`,
                    })
                        .orWhere('affiliation.email ::text ILIKE :search', {
                            search: `%${search}%`,
                        })
                        .orWhere('profile.firstName ::text ILIKE :search', {
                            search: `%${search}%`,
                        })
                        .orWhere('profile.lastName ::text ILIKE :search', {
                            search: `%${search}%`,
                        });
                })
            );
        }

        const [errorRowCount, rowCount] = await useCatch(query.getCount());
        if (errorRowCount) throw new NotFoundException(errorRowCount);

        const [error, transactions] = await useCatch(
            query
                .orderBy('affiliation.createdAt', pagination?.sort)
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

    async findOneBy(
        selections: GetOneAffiliationsSelections
    ): Promise<Affiliation> {
        const {
            code,
            productId,
            affiliationId,
            userReceivedId,
            organizationSellerId,
            organizationReceivedId,
        } = selections;
        let query = this.driver
            .createQueryBuilder('affiliation')
            .select('affiliation.id', 'id')
            .addSelect('affiliation.url', 'url')
            .addSelect('affiliation.email', 'email')
            .addSelect('affiliation.code', 'code')
            .addSelect('affiliation.percent', 'percent')
            .addSelect('affiliation.description', 'description')
            .addSelect('affiliation.expiredAt', 'expiredAt')
            .addSelect('affiliation.productId', 'productId')
            .addSelect('affiliation.createdAt', 'createdAt')
            .addSelect(
                'affiliation.organizationSellerId',
                'organizationSellerId'
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
              'title', "product"."title",
              'slug', "product"."slug"
              ) AS "product"`
            )
            .addSelect(
                /*sql*/ `jsonb_build_object(
                    'fullName', "profile"."fullName",
                    'firstName', "profile"."firstName",
                    'lastName', "profile"."lastName",
                    'email', "user"."email",
                    'image', "profile"."image",
                    'color', "profile"."color",
                    'userId', "user"."id",
                    'username', "user"."username"
                ) AS "profile"`
            )
            .where('affiliation.deletedAt IS NULL')
            .leftJoin('affiliation.product', 'product')
            .leftJoin('affiliation.user', 'user')
            .leftJoin('user.profile', 'profile');

        if (productId) {
            query = query.andWhere('affiliation.productId = :productId', {
                productId,
            });
        }

        if (userReceivedId) {
            query = query.andWhere(
                'affiliation.userReceivedId = :userReceivedId',
                {
                    userReceivedId,
                }
            );
        }

        if (code) {
            query = query
                .andWhere('affiliation.code = :code', { code })
                .andWhere("affiliation.status IN ('ACTIVE')")
                .andWhere(
                    'affiliation.expiredAt >= NOW() OR affiliation.expiredAt IS NULL'
                );
        }

        if (affiliationId) {
            query = query.andWhere('affiliation.id = :id', {
                id: affiliationId,
            });
        }

        if (organizationSellerId) {
            query = query.andWhere(
                'affiliation.organizationSellerId = :organizationSellerId',
                { organizationSellerId }
            );
        }

        if (organizationReceivedId) {
            query = query.andWhere(
                'affiliation.organizationReceivedId = :organizationReceivedId',
                { organizationReceivedId }
            );
        }

        const [error, result] = await useCatch(query.getRawOne());
        if (error)
            throw new HttpException(
                'affiliation not found',
                HttpStatus.NOT_FOUND
            );

        return result;
    }

    /** Create one Affiliation to the database. */
    async createOne(options: CreateAffiliationsOptions): Promise<Affiliation> {
        const {
            url,
            email,
            percent,
            expiredAt,
            productId,
            description,
            userReceivedId,
            organizationSellerId,
            organizationReceivedId,
        } = options;

        const affiliation = new Affiliation();
        affiliation.url = url;
        affiliation.email = email;
        affiliation.percent = percent;
        affiliation.expiredAt = expiredAt;
        affiliation.productId = productId;
        affiliation.description = description;
        affiliation.code = generateLongUUID(8);
        affiliation.userReceivedId = userReceivedId;
        affiliation.organizationSellerId = organizationSellerId;
        affiliation.organizationReceivedId = organizationReceivedId;

        const query = this.driver.save(affiliation);

        const [error, result] = await useCatch(query);
        if (error) throw new NotFoundException(error);

        return result;
    }

    /** Update one Affiliation to the database. */
    async updateOne(
        selections: UpdateAffiliationsSelections,
        options: UpdateAffiliationsOptions
    ): Promise<Affiliation> {
        const { affiliationId } = selections;
        const {
            email,
            description,
            percent,
            expiredAt,
            status,
            deletedAt,
            url,
        } = options;

        let findQuery = this.driver.createQueryBuilder('affiliation');

        if (affiliationId) {
            findQuery = findQuery.where('affiliation.id = :id', {
                id: affiliationId,
            });
        }

        const [errorFind, affiliation] = await useCatch(findQuery.getOne());
        if (errorFind) throw new NotFoundException(errorFind);

        affiliation.url = url;
        affiliation.email = email;
        affiliation.status = status;
        affiliation.percent = percent;
        affiliation.expiredAt = expiredAt;
        affiliation.deletedAt = deletedAt;
        affiliation.description = description;

        const query = this.driver.save(affiliation);

        const [errorUp, result] = await useCatch(query);
        if (errorUp) throw new NotFoundException(errorUp);

        return result;
    }
}

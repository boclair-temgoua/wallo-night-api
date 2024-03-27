import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Slug, generateNumber } from '../../app/utils/commons';
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
    private driver: Repository<Affiliation>,
  ) {}

  async findAll(
    selections: GetAffiliationsSelections,
  ): Promise<WithPaginationResponse | null> {
    const {
      search,
      pagination,
      organizationSellerId,
      organizationReceivedId,
      userReceivedId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('affiliation')
      .select('affiliation.id', 'id')
      .addSelect('affiliation.slug', 'slug')
      .addSelect('affiliation.url', 'url')
      .addSelect('affiliation.percent', 'percent')
      .addSelect('affiliation.description', 'description')
      .addSelect('affiliation.expiredAt', 'expiredAt')
      .addSelect('affiliation.productId', 'productId')
      .addSelect('affiliation.organizationSellerId', 'organizationSellerId')
      .where('affiliation.deletedAt IS NULL');

    if (organizationSellerId) {
      query = query.andWhere(
        'affiliation.organizationSellerId = :organizationSellerId',
        {
          organizationSellerId,
        },
      );
    }

    if (userReceivedId) {
      query = query.andWhere('affiliation.userReceivedId = :userReceivedId', {
        userReceivedId,
      });
    }

    if (organizationReceivedId) {
      query = query.andWhere(
        'affiliation.organizationReceivedId = :organizationReceivedId',
        {
          organizationReceivedId,
        },
      );
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('affiliation.fullName ::text ILIKE :search', {
            search: `%${search}%`,
          });
          // .orWhere('affiliation.email ::text ILIKE :search', {
          //   search: `%${search}%`,
          // })
          // .orWhere('userSend.email ::text ILIKE :search', {
          //   search: `%${search}%`,
          // })
          // .orWhere('profileSend.firstName ::text ILIKE :search', {
          //   search: `%${search}%`,
          // })
          // .orWhere('profileSend.lastName ::text ILIKE :search', {
          //   search: `%${search}%`,
          // });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, transactions] = await useCatch(
      query
        .orderBy('affiliation.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: transactions,
    });
  }

  async findOneBy(
    selections: GetOneAffiliationsSelections,
  ): Promise<Affiliation> {
    const {
      affiliationId,
      organizationSellerId,
      slug,
      productId,
      userReceivedId,
      organizationReceivedId,
    } = selections;
    let query = this.driver
      .createQueryBuilder('affiliation')
      .select('affiliation.id', 'id')
      .addSelect('affiliation.slug', 'slug')
      .addSelect('affiliation.url', 'url')
      .addSelect('affiliation.percent', 'percent')
      .addSelect('affiliation.description', 'description')
      .addSelect('affiliation.expiredAt', 'expiredAt')
      .addSelect('affiliation.productId', 'productId')
      .addSelect('affiliation.isOneProduct', 'isOneProduct')
      .addSelect('affiliation.organizationSellerId', 'organizationSellerId')
      .where('affiliation.deletedAt IS NULL');

    if (productId) {
      query = query.andWhere('affiliation.productId = :productId', {
        productId,
      });
    }

    if (userReceivedId) {
      query = query.andWhere('affiliation.userReceivedId = :userReceivedId', {
        userReceivedId,
      });
    }

    if (affiliationId) {
      query = query.andWhere('affiliation.id = :id', { id: affiliationId });
    }

    if (slug) {
      query = query.andWhere('affiliation.slug = :slug', { slug });
    }

    if (organizationSellerId) {
      query = query.andWhere(
        'affiliation.organizationSellerId = :organizationSellerId',
        { organizationSellerId },
      );
    }

    if (organizationReceivedId) {
      query = query.andWhere(
        'affiliation.organizationReceivedId = :organizationReceivedId',
        { organizationReceivedId },
      );
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('affiliation not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Affiliation to the database. */
  async createOne(options: CreateAffiliationsOptions): Promise<Affiliation> {
    const {
      slug,
      url,
      title,
      percent,
      expiredAt,
      productId,
      description,
      isOneProduct,
      userReceivedId,
      organizationSellerId,
      organizationReceivedId,
    } = options;

    const affiliation = new Affiliation();
    affiliation.slug = slug;
    affiliation.title = title;
    affiliation.url = url;
    affiliation.slug = `${
      title ? `${Slug(title)}-${generateNumber(4)}` : null
    }`;
    affiliation.percent = percent;
    affiliation.expiredAt = expiredAt;
    affiliation.productId = productId;
    affiliation.isOneProduct = isOneProduct;
    affiliation.description = description;
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
    options: UpdateAffiliationsOptions,
  ): Promise<Affiliation> {
    const { affiliationId } = selections;
    const {
      description,
      title,
      percent,
      expiredAt,
      isOneProduct,
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
    affiliation.title = title;
    affiliation.description = description;
    affiliation.percent = percent;
    affiliation.isOneProduct = isOneProduct;
    affiliation.expiredAt = expiredAt;
    affiliation.deletedAt = deletedAt;

    const query = this.driver.save(affiliation);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

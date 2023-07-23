import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from '../../models/Donation';
import { Repository } from 'typeorm';
import {
  CreateDonationOptions,
  GetOneDonationSelections,
  GetDonationsSelections,
  UpdateDonationSelections,
  UpdateDonationOptions,
} from './donations.type';
import { useCatch } from '../../app/utils/use-catch';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination/with-pagination';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private driver: Repository<Donation>,
  ) {}

  async findAll(
    selections: GetDonationsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('donation')
      .select('donation.id', 'id')
      .addSelect('donation.title', 'title')
      .addSelect('donation.amount', 'amount')
      .addSelect('donation.image', 'image')
      .addSelect('donation.userId', 'userId')
      .addSelect('donation.isActive', 'isActive')
      .addSelect('donation.createdAt', 'createdAt')
      .addSelect('donation.expiredAt', 'expiredAt')
      .addSelect('donation.organizationId', 'organizationId')
      .addSelect('donation.description', 'description')
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'code', "currency"."code",
        'symbol', "currency"."symbol"
    ) AS "currency"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
        'id', "profile"."id",
        'userId', "user"."id",
        'firstName', "profile"."firstName",
        'lastName', "profile"."lastName",
        'image', "profile"."image",
        'color', "profile"."color",
        'countryId', "profile"."countryId",
        'url', "profile"."url"
    ) AS "profile"`,
      )
      .where('donation.deletedAt IS NULL')
      .andWhere('donation.expiredAt >= now()')
      .leftJoin('donation.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('donation.currency', 'currency');

    if (userId) {
      query = query.andWhere('donation.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('donation.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere('donation.title ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Donations] = await useCatch(
      query
        .orderBy('donation.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Donations,
    });
  }

  async findOneBy(selections: GetOneDonationSelections): Promise<Donation> {
    const { donationId } = selections;
    let query = this.driver
      .createQueryBuilder('donation')
      .select('donation.id', 'id')
      .addSelect('donation.title', 'title')
      .addSelect('donation.image', 'image')
      .addSelect('donation.amount', 'amount')
      .addSelect('donation.userId', 'userId')
      .addSelect('donation.isActive', 'isActive')
      .addSelect('donation.createdAt', 'createdAt')
      .addSelect('donation.expiredAt', 'expiredAt')
      .addSelect('donation.organizationId', 'organizationId')
      .addSelect('donation.description', 'description')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'code', "currency"."code",
          'symbol', "currency"."symbol"
      ) AS "currency"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "profile"."id",
          'userId', "user"."id",
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'image', "profile"."image",
          'color', "profile"."color",
          'countryId', "profile"."countryId",
          'url', "profile"."url"
      ) AS "profile"`,
      )
      .where('donation.deletedAt IS NULL')
      .andWhere('donation.expiredAt >= now()')
      .leftJoin('donation.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('donation.currency', 'currency');

    if (donationId) {
      query = query.andWhere('donation.id = :id', { id: donationId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('donation not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Donation to the database. */
  async createOne(options: CreateDonationOptions): Promise<Donation> {
    const {
      amount,
      currencyId,
      title,
      expiredAt,
      description,
      userId,
      image,
      organizationId,
    } = options;

    const donation = new Donation();
    donation.title = title;
    donation.amount = amount;
    donation.userId = userId;
    donation.image = image;
    donation.organizationId = organizationId;
    donation.expiredAt = expiredAt;
    donation.currencyId = currencyId;
    donation.description = description;

    const query = this.driver.save(donation);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
  /** Update one Donation to the database. */
  async updateOne(
    selections: UpdateDonationSelections,
    options: UpdateDonationOptions,
  ): Promise<Donation> {
    const { donationId } = selections;
    const {
      amount,
      currencyId,
      title,
      image,
      description,
      isActive,
      expiredAt,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('donation');

    if (donationId) {
      findQuery = findQuery.where('donation.id = :id', {
        id: donationId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.amount = amount;
    findItem.currencyId = currencyId;
    findItem.title = title;
    findItem.image = image;
    findItem.isActive = isActive;
    findItem.expiredAt = expiredAt;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

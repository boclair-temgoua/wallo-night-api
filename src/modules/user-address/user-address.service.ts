import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../../models/Organization';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Repository } from 'typeorm';
import {
  CreateUserAddressOptions,
  GetUserAddressSelections,
  GetOneUserAddressSelections,
  UpdateUserAddressOptions,
  UpdateUserAddressSelections,
} from './user-address.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';
import { UserAddress } from '../../models/UserAddress';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private driver: Repository<UserAddress>,
  ) {}

  async findAll(selections: GetUserAddressSelections): Promise<UserAddress[]> {
    const { search, option1, option2 } = selections;

    let query = this.driver
      .createQueryBuilder('userAddress')
      .select('userAddress.id', 'id')
      .addSelect('userAddress.company', 'company')
      .addSelect('userAddress.city', 'city')
      .addSelect('userAddress.phone', 'phone')
      .addSelect('userAddress.region', 'region')
      .addSelect('userAddress.street1', 'street1')
      .addSelect('userAddress.street2', 'street2')
      .addSelect('userAddress.cap', 'cap')
      .addSelect('userAddress.countryId', 'countryId')
      .addSelect('userAddress.userId', 'userId')
      .addSelect('userAddress.organizationId', 'organizationId')
      .addSelect('userAddress.createdAt', 'createdAt')
      .addSelect('userAddress.updatedAt', 'updatedAt')
      .addSelect(
        /*sql*/ `(
      SELECT jsonb_build_object(
            'code', "co"."code",
            'name', "co"."name"
      )
      FROM "country" "co"
      WHERE "userAddress"."countryId" = "co"."id"
      ) AS "country"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'color', "organization"."color",
          'userId', "organization"."userId",
          'name', "organization"."name"
      ) AS "organization"`,
      )
      .where('userAddress.deletedAt IS NULL')
      .leftJoin('userAddress.organization', 'organization');

    if (option1) {
      const { userId } = option1;
      query = query.andWhere('userAddress.userId = :userId', { userId });
    }

    if (option2) {
      const { organizationId } = option2;
      query = query.andWhere('userAddress.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere('userAddress.userId ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors) throw new NotFoundException(errors);

    return results;
  }

  async findOneBy(
    selections: GetOneUserAddressSelections,
  ): Promise<UserAddress> {
    const { option1 } = selections;
    let query = this.driver
      .createQueryBuilder('userAddress')
      .where('userAddress.deletedAt IS NULL');

    if (option1) {
      const { userAddressId } = option1;
      query = query.andWhere('userAddress.id = :id', {
        id: userAddressId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('UserAddress not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one UserAddress to the database. */
  async createOne(options: CreateUserAddressOptions): Promise<UserAddress> {
    const {
      company,
      city,
      phone,
      region,
      street1,
      street2,
      cap,
      countryId,
      userId,
      organizationId,
    } = options;

    const userAddress = new UserAddress();
    userAddress.company = company;
    userAddress.city = city;
    userAddress.phone = phone;
    userAddress.region = region;
    userAddress.street1 = street1;
    userAddress.street2 = street2;
    userAddress.cap = cap;
    userAddress.countryId = countryId;
    userAddress.userId = userId;
    userAddress.organizationId = organizationId;

    const query = this.driver.save(userAddress);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one user-address to the database. */
  async updateOne(
    selections: UpdateUserAddressSelections,
    options: UpdateUserAddressOptions,
  ): Promise<UserAddress> {
    const { option1 } = selections;
    const {
      company,
      city,
      phone,
      region,
      street1,
      street2,
      cap,
      countryId,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('userAddress');

    if (option1) {
      const { userAddressId } = option1;
      findQuery = findQuery.where('userAddress.id = :id', {
        id: userAddressId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.company = company;
    findItem.city = city;
    findItem.phone = phone;
    findItem.region = region;
    findItem.street1 = street1;
    findItem.street2 = street2;
    findItem.cap = cap;
    findItem.countryId = countryId;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

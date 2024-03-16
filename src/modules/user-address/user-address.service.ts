import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import { UserAddress } from '../../models';
import {
  CreateUserAddressOptions,
  GetOneUserAddressSelections,
  UpdateUserAddressOptions,
  UpdateUserAddressSelections,
} from './user-address.type';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private driver: Repository<UserAddress>,
  ) {}

  async findOneBy(
    selections: GetOneUserAddressSelections,
  ): Promise<UserAddress> {
    const { organizationId, userId, userAddressId } = selections;
    let query = this.driver
      .createQueryBuilder('userAddress')
      .select('userAddress.id', 'id')
      .addSelect('userAddress.firstName', 'firstName')
      .addSelect('userAddress.lastName', 'lastName')
      .addSelect('userAddress.city', 'city')
      .addSelect('userAddress.cap', 'cap')
      .addSelect('userAddress.country', 'country')
      .addSelect('userAddress.phone', 'phone')
      .addSelect('userAddress.region', 'region')
      .addSelect('userAddress.isUpdated', 'isUpdated')
      .addSelect('userAddress.street1', 'street1')
      .addSelect('userAddress.street2', 'street2')
      .where('userAddress.deletedAt IS NULL');

    if (userAddressId) {
      query = query.andWhere('userAddress.id = :id', {
        id: userAddressId,
      });
    }

    if (organizationId) {
      query = query.andWhere('userAddress.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (userId) {
      query = query.andWhere('userAddress.userId = :userId', { userId });
    }
    const result = await query.getRawOne();

    return result;
  }

  /** Create one Faq to the database. */
  async createOne(options: CreateUserAddressOptions): Promise<UserAddress> {
    const {
      userId,
      firstName,
      lastName,
      city,
      cap,
      country,
      phone,
      region,
      street1,
      street2,
      organizationId,
    } = options;

    const userAddress = new UserAddress();
    userAddress.userId = userId;
    userAddress.firstName = firstName;
    userAddress.lastName = lastName;
    userAddress.city = city;
    userAddress.cap = cap;
    userAddress.country = country;
    userAddress.phone = phone;
    userAddress.region = region;
    userAddress.street1 = street1;
    userAddress.street2 = street2;
    userAddress.organizationId = organizationId;

    const query = this.driver.save(userAddress);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one UserAddress to the database. */
  async updateOne(
    selections: UpdateUserAddressSelections,
    options: UpdateUserAddressOptions,
  ): Promise<UserAddress> {
    const { userAddressId } = selections;
    const {
      userId,
      firstName,
      lastName,
      city,
      cap,
      country,
      phone,
      region,
      street1,
      street2,
      isUpdated,
      organizationId,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('userAddress');

    if (userAddressId) {
      findQuery = findQuery.where('userAddress.id = :id', {
        id: userAddressId,
      });
    }

    const [errorFind, userAddress] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    userAddress.userId = userId;
    userAddress.firstName = firstName;
    userAddress.lastName = lastName;
    userAddress.city = city;
    userAddress.cap = cap;
    userAddress.country = country;
    userAddress.phone = phone;
    userAddress.region = region;
    userAddress.street1 = street1;
    userAddress.street2 = street2;
    userAddress.isUpdated = isUpdated;
    userAddress.organizationId = organizationId;
    userAddress.deletedAt = deletedAt;

    const query = this.driver.save(userAddress);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

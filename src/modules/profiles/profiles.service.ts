import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../models/Profile';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Repository } from 'typeorm';
import {
  CreateProfileOptions,
  GetOneProfileSelections,
  UpdateProfileOptions,
  UpdateProfileSelections,
} from './profiles.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private driver: Repository<Profile>,
  ) {}

  async findOneBy(selections: GetOneProfileSelections): Promise<Profile> {
    const { profileId } = selections;
    let query = this.driver.createQueryBuilder('profile');

    if (profileId) {
      query = query.where('profile.id = :id', { id: profileId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Profile to the database. */
  async createOne(options: CreateProfileOptions): Promise<Profile> {
    const {
      fullName,
      currencyId,
      countryId,
      url,
      image,
      phone,
      firstAddress,
      secondAddress,
      birthday,
    } = options;

    const profile = new Profile();
    profile.image = image;
    profile.fullName = fullName;
    profile.phone = phone;
    profile.firstAddress = firstAddress;
    profile.secondAddress = secondAddress;
    profile.birthday = birthday;
    profile.color = getRandomElement(colorsArrays);
    profile.currencyId = currencyId;
    profile.countryId = countryId;
    profile.url = url;

    const query = this.driver.save(profile);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Profile to the database. */
  async updateOne(
    selections: UpdateProfileSelections,
    options: UpdateProfileOptions,
  ): Promise<Profile> {
    const { profileId } = selections;
    const {
      fullName,
      currencyId,
      countryId,
      image,
      url,
      phone,
      firstAddress,
      description,
      secondAddress,
      birthday,
      color,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('profile');

    if (profileId) {
      findQuery = findQuery.where('profile.id = :id', {
        id: profileId,
      });
    }

    const [errorFind, profile] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    profile.image = image;
    profile.url = url;
    profile.phone = phone;
    profile.color = color;
    profile.description = description;
    profile.firstAddress = firstAddress;
    profile.secondAddress = secondAddress;
    profile.birthday = birthday;
    profile.countryId = countryId;
    profile.fullName = fullName;
    profile.currencyId = currencyId;
    profile.deletedAt = deletedAt;

    const query = this.driver.save(profile);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

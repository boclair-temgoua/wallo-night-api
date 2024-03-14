import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { colorsArrays, isNotUndefined } from '../../app/utils/commons';
import { useCatch } from '../../app/utils/use-catch';
import { Profile } from '../../models';
import {
  CreateProfileOptions,
  GetOneProfileSelections,
  UpdateProfileOptions,
  UpdateProfileSelections,
} from './profiles.type';

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
      firstName,
      lastName,
      currencyId,
      countryId,
      url,
      phone,
      social,
      image,
      firstAddress,
      secondAddress,
      birthday,
      enableCommission,
      enableShop,
      enableGallery,
    } = options;

    const profile = new Profile();
    profile.fullName = fullName;
    profile.social = social;
    profile.phone = phone;
    profile.image = image;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.firstAddress = firstAddress;
    profile.secondAddress = secondAddress;
    profile.birthday = birthday;
    profile.color = getRandomElement(colorsArrays);
    profile.currencyId = currencyId;
    profile.enableShop = enableShop;
    profile.enableGallery = enableGallery;
    profile.enableCommission = enableCommission;
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
      firstName,
      lastName,
      currencyId,
      countryId,
      url,
      phone,
      social,
      firstAddress,
      description,
      secondAddress,
      birthday,
      color,
      image,
      enableCommission,
      enableShop,
      enableGallery,
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

    profile.url = url;
    profile.phone = phone;
    profile.color = color;
    profile.social = social;
    if (isNotUndefined(String(image))) {
      profile.image = image;
    }
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.description = description;
    profile.firstAddress = firstAddress;
    profile.secondAddress = secondAddress;
    profile.birthday = birthday;
    profile.countryId = countryId;
    profile.fullName = fullName;
    profile.enableShop = enableShop;
    profile.enableGallery = enableGallery;
    profile.enableCommission = enableCommission;
    profile.currencyId = currencyId;
    profile.deletedAt = deletedAt;

    const query = this.driver.save(profile);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}

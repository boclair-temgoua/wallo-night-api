import { generateNumber } from '../../utils/commons/generate-random';
// import { MigrationInterface, QueryRunner } from 'typeorm';
import { Repository, MigrationInterface, QueryRunner } from 'typeorm';

import { faker } from '@faker-js/faker';
import { Country } from '../../../models/Country';
import { AppSeedDataSource } from '../orm/orm-config-seed';

import * as Slug from 'slug';
import {
  Contributor,
  Post,
  Profile,
  Follow,
  User,
  Wallet,
} from '../../../models';
import * as bcrypt from 'bcryptjs';
import { getRandomElement } from '../../utils/array/get-random-element';
import { colorsArrays } from '../../utils/commons/get-colors';
import { ContributorRole } from '../../../modules/contributors/contributors.type';
import { NextStep } from '../../../modules/users/users.type';

export class Seeds1590629635401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const driver = AppSeedDataSource;

    for (let i = 0; i < 100; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const country = await driver
        .createQueryBuilder(Country, 'country')
        .select('country.id', 'id')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      const { identifiers: saveProfile } = await driver
        .createQueryBuilder()
        .insert()
        .into(Profile)
        .values({
          color: getRandomElement(colorsArrays),
          countryId: country?.id,
          firstName: firstName,
          lastName: lastName,
        })
        .execute();
      const profile = { ...saveProfile['0'] };

      const { identifiers: saveUser } = await driver
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: `${firstName}-${lastName}`.toLocaleLowerCase(),
          email: faker.internet.email().toLocaleLowerCase(),
          password: await bcrypt.hashSync('password', 8),
          profileId: profile?.id,
          confirmedAt: new Date(),
          nextStep: NextStep.COMPLETE_REGISTRATION,
        })
        .execute();
      const user = { ...saveUser['0'] };

      await driver
        .createQueryBuilder()
        .insert()
        .into(Contributor)
        .values({
          userId: user?.id,
          userCreatedId: user?.id,
          role: ContributorRole.ADMIN,
        })
        .execute();

      // await driver
      //   .createQueryBuilder()
      //   .insert()
      //   .into(Wallet)
      //   .values({
      //     userId: user?.id,
      //   })
      //   .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** User seed finish ****');

    for (let i = 0; i < 400; i++) {
      const title = faker.lorem.sentence(2);
      const user = await driver
        .createQueryBuilder(User, 'user')
        .select('user.id', 'id')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      await driver
        .createQueryBuilder()
        .insert()
        .into(Post)
        .values({
          title,
          whoCanSee: getRandomElement([
            'PUBLIC',
            'SUPPORTER',
            'MEMBERSHIP',
          ]) as any,
          type: getRandomElement(['ARTICLE', 'AUDIO', 'GALLERY']) as any,
          image: faker.image.url(),
          description: faker.lorem.sentence(6),
          userId: user?.id,
        })
        .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** Post seed finish ****');

    for (let i = 0; i < 800; i++) {
      const userFollower = await driver
        .createQueryBuilder(User, 'user')
        .select('user.id', 'id')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      const user = await driver
        .createQueryBuilder(User, 'user')
        .select('user.id', 'id')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      await driver
        .createQueryBuilder()
        .insert()
        .into(Follow)
        .values({
          followerId: userFollower?.id,
          userId: user?.id,
        })
        .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** Follow seed finish ****');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}

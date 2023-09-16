// import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationInterface, QueryRunner } from 'typeorm';

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
  Comment,
  Subscribe,
} from '../../../models';
import * as bcrypt from 'bcryptjs';
import { getRandomElement } from '../../utils/array/get-random-element';
import { colorsArrays } from '../../utils/commons/get-colors';
import { addYearsFormateDDMMYYDate } from '../../utils/commons/formate-date';

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
          image: faker.image.url(),
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
          nextStep: 'COMPLETE_REGISTRATION',
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
          role: 'ADMIN',
        })
        .execute();

      await driver
        .createQueryBuilder()
        .insert()
        .into(Subscribe)
        .values({
          userId: user?.id,
          subscriberId: user?.id,
          expiredAt: addYearsFormateDDMMYYDate({
            date: new Date(),
            yearNumber: 50,
          }),
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

    for (let i = 0; i < 200; i++) {
      const title = faker.lorem.sentence({ min: 5, max: 15 });
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
          title: title,
          whoCanSee: getRandomElement([
            'PUBLIC',
            'SUPPORTER',
            'MEMBERSHIP',
          ]) as any,
          type: getRandomElement(['ARTICLE', 'AUDIO', 'GALLERY']) as any,
          slug: Slug(title),
          description: faker.lorem.sentence({ min: 100, max: 300 }),
          userId: user?.id,
        })
        .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** Post seed finish ****');

    for (let i = 0; i < 600; i++) {
      const title = faker.lorem.sentence(2);
      const user = await driver
        .createQueryBuilder(User, 'user')
        .select('user.id', 'id')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      const post = await driver
        .createQueryBuilder(Post, 'post')
        .select('post.id', 'id')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      await driver
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          userId: user?.id,
          postId: post?.id,
          description: faker.lorem.sentence({ min: 10, max: 50 }),
        })
        .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** Comment seed finish ****');

    for (let i = 0; i < 400; i++) {
      const user = await driver
        .createQueryBuilder(User, 'user')
        .select('user.id', 'id')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      const comment = await driver
        .createQueryBuilder(Comment, 'comment')
        .select('comment.id', 'id')
        .addSelect('comment.postId', 'postId')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      await driver
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          parentId: comment?.id,
          postId: comment?.postId,
          description: faker.lorem.sentence({ min: 2, max: 10 }),
          userId: user?.id,
        })
        .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** Comment reply seed finish ****');

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

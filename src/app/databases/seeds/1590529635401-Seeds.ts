import { generateNumber } from '../../utils/commons/generate-random';
// import { MigrationInterface, QueryRunner } from 'typeorm';
import { Repository, MigrationInterface, QueryRunner, Not } from 'typeorm';

import { faker } from '@faker-js/faker';
import { useCatch } from '../../utils/use-catch';
import { Currency } from '../../../models/Currency';
import { Country } from '../../../models/Country';
import { AppSeedDataSource } from '../config/orm-config-seed';

import { Faq } from '../../../models/Faq';
import * as Slug from 'slug';
import { Profile } from '../../../models/Profile';
import { getRandomElement } from '../../utils/array/get-random-element';
import { colorsArrays } from '../../utils/commons/get-colors';
import { Organization } from '../../../models/Organization';
import { User } from '../../../models/User';
import { Contributor } from '../../../models/Contributor';
import { ContributorRole } from '../../../modules/contributors/contributors.type';

export class Seeds1590529635401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const driver = AppSeedDataSource;

    for (let i = 0; i < 20; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

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
          image: faker.image.abstract(),
          color: getRandomElement(colorsArrays),
          countryId: country?.id,
          firstName: firstName,
          lastName: lastName,
        })
        .execute();
      const profile = { ...saveProfile['0'] };

      const { identifiers: saveOrganization } = await driver
        .createQueryBuilder()
        .insert()
        .into(Organization)
        .values({
          name: `${firstName} ${lastName}`,
          color: getRandomElement(colorsArrays),
        })
        .execute();
      const organization = { ...saveOrganization['0'] };

      const { identifiers: saveUser } = await driver
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: `${firstName}.${lastName}`.toLocaleLowerCase(),
          email: faker.internet.email().toLocaleLowerCase(),
          password:
            '$2a$08$ufZaH/SgqakjWlOxMU7EF.JCaya/s1Wy2xsJK.OPG6kNMfJ3ZYe.C',
          profileId: profile?.id,
          organizationInUtilizationId: organization?.id,
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
          organizationId: organization?.id,
        })
        .execute();

      await driver
        .createQueryBuilder()
        .update(Organization)
        .set({
          userId: user?.id,
        })
        .where('id = :id', { id: organization?.id })
        .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** User seed finish ****');

    for (let i = 0; i < 300; i++) {
      const user = await driver
        .createQueryBuilder(User, 'user')
        .select('user.id', 'id')
        .addSelect(
          'user.organizationInUtilizationId',
          'organizationInUtilizationId',
        )
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      const organization = await driver
        .createQueryBuilder(Organization, 'organization')
        .select('organization.id', 'id')
        .orderBy('RANDOM()')
        .limit(1)
        .getRawOne();

      await driver
        .createQueryBuilder()
        .insert()
        .into(Contributor)
        .values({
          userId: user?.id,
          userCreatedId: user?.id,
          role: ContributorRole.MODERATOR,
          organizationId: organization?.id,
        })
        .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** Contributor seed finish ****');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}

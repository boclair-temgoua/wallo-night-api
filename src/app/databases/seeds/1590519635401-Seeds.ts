import { generateNumber } from './../../utils/commons/generate-random';
// import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { faker } from '@faker-js/faker';
import { AppSeedDataSource } from '../config/orm-config-seed';

import { Faq } from '../../../models/Faq';
import * as Slug from 'slug';

export class Seeds1590519635401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const driver = AppSeedDataSource;
    const title = faker.lorem.sentence(5);

    for (let i = 0; i < 100; i++) {
      await driver
        .createQueryBuilder()
        .insert()
        .into(Faq)
        .values({
          slug: `${Slug(title)}-${generateNumber(4)}`,
          title: title,
          status: faker.datatype.boolean(),
          description: faker.lorem.lines(),
        })
        .execute();
    }
    console.log('\x1b[32m%s\x1b[0m', '**** faqs seed finish ****');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}

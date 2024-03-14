import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1710359463509 implements MigrationInterface {
  name = 'Migration1710359463509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "image"`);
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "upload" ADD "profileId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "profileId"`);
    await queryRunner.query(`ALTER TABLE "payment" ADD "description" text`);
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "image" character varying`,
    );
  }
}
